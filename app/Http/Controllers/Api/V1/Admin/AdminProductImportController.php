<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use ZipArchive;

class AdminProductImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt,xlsx', 'max:5120'],
        ]);

        $file = $request->file('file');
        $extension = strtolower($file->getClientOriginalExtension());

        $rows = $extension === 'xlsx'
            ? $this->readXlsx($file->getRealPath())
            : $this->readCsv($file->getRealPath());

        if (count($rows) < 2) {
            return response()->json([
                'success' => false,
                'message' => 'File import kosong atau tidak memiliki data produk.',
            ], 422);
        }

        $header = array_map(fn ($item) => Str::snake(trim((string) $item)), $rows[0]);
        $dataRows = array_slice($rows, 1);

        $requiredHeaders = [
            'name',
            'sku',
            'category',
            'price',
            'stock',
            'weight_gram',
            'description',
            'image_url',
            'is_active',
        ];

        $missingHeaders = array_values(array_diff($requiredHeaders, $header));

        if (!empty($missingHeaders)) {
            return response()->json([
                'success' => false,
                'message' => 'Header file belum sesuai dengan template.',
                'missing_headers' => $missingHeaders,
                'required_headers' => $requiredHeaders,
            ], 422);
        }

        $created = 0;
        $updated = 0;
        $failed = 0;
        $errors = [];

        DB::transaction(function () use ($dataRows, $header, &$created, &$updated, &$failed, &$errors) {
            foreach ($dataRows as $index => $row) {
                $rowNumber = $index + 2;
                $item = $this->combineRow($header, $row);

                if ($this->isEmptyRow($item)) {
                    continue;
                }

                try {
                    $name = trim((string) ($item['name'] ?? ''));
                    $sku = strtoupper(trim((string) ($item['sku'] ?? '')));
                    $categoryName = trim((string) ($item['category'] ?? ''));
                    $price = (int) preg_replace('/[^0-9]/', '', (string) ($item['price'] ?? 0));
                    $stock = (int) preg_replace('/[^0-9]/', '', (string) ($item['stock'] ?? 0));
                    $weightGram = (int) preg_replace('/[^0-9]/', '', (string) ($item['weight_gram'] ?? 500));
                    $description = trim((string) ($item['description'] ?? ''));
                    $imageUrl = trim((string) ($item['image_url'] ?? ''));
                    $isActive = $this->parseBoolean($item['is_active'] ?? true);

                    if (!$name || !$sku || !$categoryName) {
                        throw new \Exception('Nama produk, SKU, dan kategori wajib diisi.');
                    }

                    if ($price < 0 || $stock < 0) {
                        throw new \Exception('Harga atau stok tidak valid.');
                    }

                    if ($weightGram <= 0) {
                        $weightGram = 500;
                    }

                    $category = Category::firstOrCreate(
                        ['slug' => Str::slug($categoryName)],
                        [
                            'parent_id' => null,
                            'name' => $categoryName,
                            'description' => null,
                            'sort_order' => 0,
                        ]
                    );

                    $existingProduct = Product::where('sku', $sku)->first();

                    $product = Product::updateOrCreate(
                        ['sku' => $sku],
                        [
                            'category_id' => $category->id,
                            'name' => $name,
                            'slug' => $existingProduct?->slug ?: $this->makeUniqueSlug($name),
                            'description' => $description ?: null,
                            'price_sen' => $price,
                            'weight_gram' => $weightGram,
                            'is_bundle' => false,
                            'is_active' => $isActive,
                        ]
                    );

                    $existingProduct ? $updated++ : $created++;

                    ProductVariation::updateOrCreate(
                        [
                            'product_id' => $product->id,
                            'name' => 'Default',
                        ],
                        [
                            'sku' => $sku . '-DEFAULT',
                            'price_sen' => null,
                            'stock_qty' => $stock,
                            'is_active' => true,
                        ]
                    );

                    if ($imageUrl) {
                        $product->images()->where('is_primary', true)->update([
                            'is_primary' => false,
                        ]);

                        ProductImage::updateOrCreate(
                            [
                                'product_id' => $product->id,
                                'url' => $imageUrl,
                            ],
                            [
                                'sort_order' => 0,
                                'is_primary' => true,
                            ]
                        );
                    }
                } catch (\Throwable $th) {
                    $failed++;

                    $errors[] = [
                        'row' => $rowNumber,
                        'message' => $th->getMessage(),
                    ];
                }
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Import produk selesai.',
            'summary' => [
                'created' => $created,
                'updated' => $updated,
                'failed' => $failed,
            ],
            'errors' => $errors,
        ]);
    }

    public function template()
    {
        $rows = [
            [
                'name',
                'sku',
                'category',
                'price',
                'stock',
                'weight_gram',
                'description',
                'image_url',
                'is_active',
            ],
            [
                'Yamaha F310 Acoustic Guitar',
                'GTR-YMH-F310',
                'Gitar',
                '2350000',
                '12',
                '2500',
                'Gitar akustik untuk pemula dan intermediate.',
                'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=900',
                '1',
            ],
            [
                'Roland GO:KEYS Keyboard',
                'KEY-ROL-GOKEYS',
                'Keyboard',
                '4700000',
                '8',
                '4500',
                'Keyboard portable untuk latihan dan performa musik.',
                'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=900',
                '1',
            ],
        ];

        $content = '';

        foreach ($rows as $row) {
            $content .= implode(',', array_map(function ($value) {
                return '"' . str_replace('"', '""', $value) . '"';
            }, $row)) . "\n";
        }

        return response($content, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="template-import-produk-nadakita.csv"',
        ]);
    }

    private function readCsv(string $path): array
    {
        $rows = [];

        if (($handle = fopen($path, 'r')) !== false) {
            while (($data = fgetcsv($handle, 10000, ',')) !== false) {
                $rows[] = $data;
            }

            fclose($handle);
        }

        return $rows;
    }

    private function readXlsx(string $path): array
    {
        $zip = new ZipArchive();

        if ($zip->open($path) !== true) {
            throw new \Exception('File Excel tidak dapat dibaca. Gunakan CSV jika server belum mendukung XLSX.');
        }

        $sharedStrings = [];
        $sharedXml = $zip->getFromName('xl/sharedStrings.xml');

        if ($sharedXml) {
            $xml = simplexml_load_string($sharedXml);

            foreach ($xml->si as $si) {
                $text = '';

                if (isset($si->t)) {
                    $text = (string) $si->t;
                } elseif (isset($si->r)) {
                    foreach ($si->r as $run) {
                        $text .= (string) $run->t;
                    }
                }

                $sharedStrings[] = $text;
            }
        }

        $sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');

        if (!$sheetXml) {
            throw new \Exception('Sheet pertama tidak ditemukan pada file Excel.');
        }

        $sheet = simplexml_load_string($sheetXml);
        $rows = [];

        foreach ($sheet->sheetData->row as $row) {
            $cells = [];
            $currentColumn = 1;

            foreach ($row->c as $cell) {
                $cellRef = (string) $cell['r'];
                $columnIndex = $this->columnNameToNumber(preg_replace('/\d+/', '', $cellRef));

                while ($currentColumn < $columnIndex) {
                    $cells[] = '';
                    $currentColumn++;
                }

                $value = '';

                if (isset($cell->v)) {
                    $value = (string) $cell->v;

                    if ((string) $cell['t'] === 's') {
                        $value = $sharedStrings[(int) $value] ?? '';
                    }
                }

                $cells[] = $value;
                $currentColumn++;
            }

            $rows[] = $cells;
        }

        $zip->close();

        return $rows;
    }

    private function columnNameToNumber(string $columnName): int
    {
        $number = 0;
        $letters = str_split(strtoupper($columnName));

        foreach ($letters as $letter) {
            $number = $number * 26 + (ord($letter) - ord('A') + 1);
        }

        return $number;
    }

    private function combineRow(array $header, array $row): array
    {
        $result = [];

        foreach ($header as $index => $key) {
            $result[$key] = $row[$index] ?? null;
        }

        return $result;
    }

    private function isEmptyRow(array $row): bool
    {
        foreach ($row as $value) {
            if (trim((string) $value) !== '') {
                return false;
            }
        }

        return true;
    }

    private function parseBoolean($value): bool
    {
        return in_array(strtolower((string) $value), [
            '1',
            'true',
            'yes',
            'ya',
            'aktif',
            'active',
        ], true);
    }

    private function makeUniqueSlug(string $name): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}