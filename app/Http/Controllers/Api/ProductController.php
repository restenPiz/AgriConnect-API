<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'unit' => 'required|in:kg,g,piece,bunch,bag,liter',
            'available_quantity' => 'required|numeric|min:0',
            'category' => 'required|in:vegetables,fruits,grains,legumes,herbs,roots,dairy,meat',
            'harvest_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after:harvest_date',
            'is_organic' => 'boolean',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max per image
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Handle image uploads
            $imageUrls = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('products', 'public');
                    $imageUrls[] = Storage::url($path);
                }
            }

            // Create product
            $product = Product::create([
                'farmer_id' => $request->farmer_id,
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'unit' => $request->unit,
                'available_quantity' => $request->available_quantity,
                'category' => $request->category,
                'image_urls' => json_encode($imageUrls),
                'harvest_date' => $request->harvest_date,
                'expiry_date' => $request->expiry_date,
                'is_organic' => $request->is_organic ?? false,
                'status' => 'active',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByFarmer($farmerId)
    {
        try {
            $products = Product::where('farmer_id', $farmerId)
                ->orderBy('created_at', 'desc')
                ->get(); // Usar get() em vez de paginate()

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function index(Request $request, $id)
    {
        $query = Product::where('farmer_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function show($id)
    {
        $product = Product::where('farmer_id', auth()->id())
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::where('farmer_id', auth()->id())
            ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'unit' => 'sometimes|in:kg,g,piece,bunch,bag,liter',
            'available_quantity' => 'sometimes|numeric|min:0',
            'category' => 'sometimes|in:vegetables,fruits,grains,legumes,herbs,roots,dairy,meat',
            'harvest_date' => 'nullable|date',
            'expiry_date' => 'nullable|date',
            'is_organic' => 'boolean',
            'status' => 'sometimes|in:active,soldOut,expired,inactive',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Handle new images
            if ($request->hasFile('images')) {
                // Delete old images
                $oldImages = json_decode($product->image_urls, true);
                if ($oldImages) {
                    foreach ($oldImages as $oldImage) {
                        $path = str_replace('/storage/', '', $oldImage);
                        Storage::disk('public')->delete($path);
                    }
                }

                // Upload new images
                $imageUrls = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('products', 'public');
                    $imageUrls[] = Storage::url($path);
                }
                $product->image_urls = json_encode($imageUrls);
            }

            // Update other fields
            $product->fill($request->except(['images', 'farmer_id']));
            $product->save();

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function destroy($id)
    {
        $product = Product::where('farmer_id', $id)
            ->findOrFail($id);

        try {
            // Delete images
            $images = json_decode($product->image_urls, true);
            if ($images) {
                foreach ($images as $image) {
                    $path = str_replace('/storage/', '', $image);
                    Storage::disk('public')->delete($path);
                }
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
