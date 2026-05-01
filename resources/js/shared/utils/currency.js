export const formatRupiah = (priceInSen) => {
    if (priceInSen === null || priceInSen === undefined) return '';
    const priceInRupiah = priceInSen / 100;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(priceInRupiah);
};
