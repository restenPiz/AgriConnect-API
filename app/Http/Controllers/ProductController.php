<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('farmer') // Carregar relação com o farmer/user
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($product) {
                // Processar image_urls
                $imageUrls = is_string($product->image_urls)
                    ? json_decode($product->image_urls, true)
                    : $product->image_urls;

                // Pegar primeira imagem ou emoji padrão
                $firstImage = !empty($imageUrls) && is_array($imageUrls)
                    ? $imageUrls[0]
                    : '📦';

                // Determinar status baseado no estoque
                $status = $product->status;
                if ($product->available_quantity == 0) {
                    $status = 'out_of_stock';
                } elseif ($product->available_quantity < 100) {
                    $status = 'low_stock';
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'farmer' => $product->farmer ? $product->farmer->name : 'Unknown',
                    'farmer_id' => $product->farmer_id,
                    'category' => ucfirst($product->category),
                    'price' => (float) $product->price,
                    'unit' => $product->unit,
                    'stock' => (float) $product->available_quantity,
                    'status' => $status,
                    'image' => $firstImage,
                    'image_urls' => $imageUrls,
                    'is_organic' => $product->is_organic,
                    'harvest_date' => $product->harvest_date,
                    'expiry_date' => $product->expiry_date,
                    'rating' => $product->rating,
                    'review_count' => $product->review_count,
                    'created_at' => $product->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('Pages/Product', [
            'products' => $products,
        ]);
    }
}
