<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdSettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::whereIn('key', ['show_ads', 'ad_frequency', 'ad_slot', 'ad_client_id'])
            ->pluck('value', 'key');

        return Inertia::render('Admin/Ads/Index', [
            'settings' => [
                'show_ads' => $settings['show_ads'] ?? '0',
                'ad_frequency' => $settings['ad_frequency'] ?? '3',
                'ad_slot' => $settings['ad_slot'] ?? '',
                'ad_client_id' => $settings['ad_client_id'] ?? '',
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'show_ads' => 'required|boolean',
            'ad_frequency' => 'required|integer|min:1',
            'ad_slot' => 'nullable|string',
            'ad_client_id' => 'nullable|string',
        ]);

        Setting::updateOrCreate(
            ['key' => 'show_ads'],
            ['value' => $validated['show_ads'] ? '1' : '0']
        );

        Setting::updateOrCreate(
            ['key' => 'ad_frequency'],
            ['value' => (string) $validated['ad_frequency']]
        );

        Setting::updateOrCreate(
            ['key' => 'ad_slot'],
            ['value' => (string) ($validated['ad_slot'] ?? '')]
        );

        Setting::updateOrCreate(
            ['key' => 'ad_client_id'],
            ['value' => (string) ($validated['ad_client_id'] ?? '')]
        );

        return redirect()->back()->with('success', 'Configuración de anuncios actualizada.');
    }
}
