<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TalkResource;
use App\Models\Talk;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TalkController extends Controller
{
    /** GET /api/talks (público): charlas publicadas, por fecha. Filtro opcional ?category_id= */
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate(['category_id' => ['nullable', 'integer']]);

        $talks = Talk::published()
            ->with(['category', 'location'])
            ->when($request->filled('category_id'), fn ($q) => $q->where('category_id', $request->integer('category_id')))
            ->orderBy('starts_at')
            ->get();

        return TalkResource::collection($talks);
    }

    /** GET /api/talks/{id} (público): detalle. Un borrador responde 404. */
    public function show(int $id): TalkResource
    {
        $talk = Talk::published()->with(['category', 'location'])->findOrFail($id);

        return new TalkResource($talk);
    }
}
