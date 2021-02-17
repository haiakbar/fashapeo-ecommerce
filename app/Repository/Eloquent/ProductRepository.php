<?php

namespace App\Repository\Eloquent;

use App\Models\Category;
use App\Models\MasterProduct;
use App\Repository\ProductRepositoryInterface;
use Illuminate\Support\Facades\Cookie;

class ProductRepository implements ProductRepositoryInterface
{
    public $paginate = 8;
    public $master;

    public function __construct(MasterProduct $master)
    {
        $this->master = $master;
    }

    public function all($page = null)
    {
        return $this->master->orderByDesc('created_at')->paginate(10);
    }

    public function archived($page = null)
    {
        return $this->master->onlyTrashed()->paginate(10);
    }

    public function search($query)
    {
        return $this->master->withRelationship()->search($query)->paginate($this->paginate);
    }

    public function category(Category $category, $page = null)
    {
        // children
        if ($category->parent_id) {
            return $this->master->where('category_id', $category->id)->withRelationship()->paginate($this->paginate);
        }
        // parent
        return $this->master->whereIn('category_id', $category->children->plucK('id'))->withRelationship()->paginate($this->paginate);
    }

    public function categoryFilter(Category $category, $min, $max)
    {
        // $query = $this->master->where('category_id', $category->id)
        // if ($term && ($min || $max)) {
        //     if ($min || $max) {
        //         //
        //     } else if ($min) {
        //         //
        //     } else if ($max) {
        //         //
        //     }
        // } else if ($term) {
        //     //
        // } else if ($min) {
        //     //
        // } else if ($max) {
        //     //
        // }
    }

    public function categorySearch(Category $category, $term)
    {
        //
    }

    public function findBySlug($product)
    {
        return $this->master->where('slug', $product)->withRelationship()->first();
    }

    public function bestSeller()
    {
        return $this->master->withRelationship()->get()->sortByDesc('sold')->take(8);
    }

    public function newArrival()
    {
        return $this->master->withRelationship()->latest()->paginate($this->paginate);
    }

    public function recentViewed()
    {
        $lists = Cookie::get('lastVisited');

        return $this->master->withRelationship()->whereIn('slug', explode(',', $lists))->get();
    }
}
