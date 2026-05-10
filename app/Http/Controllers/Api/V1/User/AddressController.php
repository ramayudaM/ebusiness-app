<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Services\RajaOngkirService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    protected $rajaOngkir;

    public function __construct(RajaOngkirService $rajaOngkir)
    {
        $this->rajaOngkir = $rajaOngkir;
    }

    public function index()
    {
        $addresses = Address::where('user_id', Auth::id())
            ->orderBy('is_default', 'desc')
            ->get();

        return response()->json($addresses);
    }

    public function store(Request $request)
    {
        $request->validate([
            'label' => 'required|string',
            'receiver_name' => 'required|string',
            'phone_number' => 'required|string',
            'province_id' => 'required|integer',
            'province_name' => 'required|string',
            'city_id' => 'required|integer',
            'city_name' => 'required|string',
            'full_address' => 'required|string',
            'postal_code' => 'required|string',
            'is_default' => 'boolean',
        ]);

        if ($request->is_default) {
            Address::where('user_id', Auth::id())->update(['is_default' => false]);
        }

        $address = Address::create([
            'user_id' => Auth::id(),
            'label' => $request->label,
            'receiver_name' => $request->receiver_name,
            'phone_number' => $request->phone_number,
            'province_id' => $request->province_id,
            'province_name' => $request->province_name,
            'city_id' => $request->city_id,
            'city_name' => $request->city_name,
            'full_address' => $request->full_address,
            'postal_code' => $request->postal_code,
            'is_default' => $request->is_default ?? false,
        ]);

        return response()->json([
            'message' => 'Alamat berhasil ditambahkan',
            'address' => $address
        ]);
    }

    public function update(Request $request, $id)
    {
        $address = Address::where('user_id', Auth::id())->findOrFail($id);

        if ($request->is_default) {
            Address::where('user_id', Auth::id())->update(['is_default' => false]);
        }

        $address->update($request->all());

        return response()->json([
            'message' => 'Alamat berhasil diperbarui',
            'address' => $address
        ]);
    }

    public function destroy($id)
    {
        $address = Address::where('user_id', Auth::id())->findOrFail($id);
        $address->delete();

        return response()->json([
            'message' => 'Alamat berhasil dihapus'
        ]);
    }

    public function getProvinces()
    {
        $provinces = $this->rajaOngkir->getProvinces();
        
        return response()->json($provinces);
    }

    public function getCities($provinceId)
    {
        $cities = $this->rajaOngkir->getCities($provinceId);

        return response()->json($cities);
    }
}
