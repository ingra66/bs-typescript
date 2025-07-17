<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FooterController extends Controller
{
    /**
     * Obtener datos del footer
     */
    public function index(): JsonResponse
    {
        $footerData = [
            'sections' => [
                [
                    'id' => 1,
                    'title' => 'Soporte',
                    'order' => 1,
                    'is_active' => true,
                    'links' => [
                        [
                            'id' => 1,
                            'title' => 'Help Center',
                            'url' => '/help',
                            'type' => 'support',
                            'order' => 1,
                            'is_active' => true
                        ],
                        [
                            'id' => 2,
                            'title' => 'Product Support',
                            'url' => '/support',
                            'type' => 'support',
                            'order' => 2,
                            'is_active' => true
                        ],
                        [
                            'id' => 3,
                            'title' => 'Warranty',
                            'url' => '/warranty',
                            'type' => 'support',
                            'order' => 3,
                            'is_active' => true
                        ],
                        [
                            'id' => 4,
                            'title' => 'Order Tracking',
                            'url' => '/tracking',
                            'type' => 'support',
                            'order' => 4,
                            'is_active' => true
                        ],
                        [
                            'id' => 5,
                            'title' => 'Contact Us',
                            'url' => '/contact',
                            'type' => 'support',
                            'order' => 5,
                            'is_active' => true
                        ]
                    ]
                ],
                [
                    'id' => 2,
                    'title' => 'Acerca de',
                    'order' => 2,
                    'is_active' => true,
                    'links' => [
                        [
                            'id' => 6,
                            'title' => 'About',
                            'url' => '/about',
                            'type' => 'about',
                            'order' => 1,
                            'is_active' => true
                        ],
                        [
                            'id' => 7,
                            'title' => 'Music with a Mission',
                            'url' => '/mission',
                            'type' => 'about',
                            'order' => 2,
                            'is_active' => true
                        ],
                        [
                            'id' => 8,
                            'title' => 'Soundlab Rewards',
                            'url' => '/rewards',
                            'type' => 'about',
                            'order' => 3,
                            'is_active' => true
                        ],
                        [
                            'id' => 9,
                            'title' => 'Affiliates + Creators',
                            'url' => '/affiliates',
                            'type' => 'about',
                            'order' => 4,
                            'is_active' => true
                        ],
                        [
                            'id' => 10,
                            'title' => 'Press Releases',
                            'url' => '/press',
                            'type' => 'about',
                            'order' => 5,
                            'is_active' => true
                        ]
                    ]
                ]
            ],
            'social_media' => [
                'instagram' => 'https://instagram.com/beltspot',
                'youtube' => 'https://youtube.com/beltspot',
                'facebook' => 'https://facebook.com/beltspot',
                'twitter' => 'https://twitter.com/beltspot'
            ],
            'company_info' => [
                'name' => 'BeltSpot',
                'description' => 'Tu tienda de confianza para cinturones de calidad',
                'logo_url' => '/logo-beltspot.png',
                'copyright_text' => '© 2025, BELTSPOT'
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $footerData
        ]);
    }

    /**
     * Obtener información de contacto
     */
    public function contactInfo(): JsonResponse
    {
        $contactInfo = [
            'email' => 'contact@beltspot.com',
            'phone' => '+1 (555) 123-4567',
            'address' => '123 Main St, City, State 12345',
            'hours' => 'Monday - Friday: 9AM - 6PM',
            'social_media' => [
                'instagram' => 'https://instagram.com/beltspot',
                'youtube' => 'https://youtube.com/beltspot',
                'facebook' => 'https://facebook.com/beltspot',
                'twitter' => 'https://twitter.com/beltspot'
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $contactInfo
        ]);
    }

    /**
     * Obtener páginas legales
     */
    public function legalPages(): JsonResponse
    {
        $legalPages = [
            [
                'id' => 1,
                'title' => 'Privacy Policy',
                'url' => '/privacy',
                'slug' => 'privacy',
                'content' => 'Política de privacidad de BeltSpot...'
            ],
            [
                'id' => 2,
                'title' => 'Terms of Use',
                'url' => '/terms',
                'slug' => 'terms',
                'content' => 'Términos de uso de BeltSpot...'
            ],
            [
                'id' => 3,
                'title' => 'Accessibility Statement',
                'url' => '/accessibility',
                'slug' => 'accessibility',
                'content' => 'Declaración de accesibilidad de BeltSpot...'
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $legalPages
        ]);
    }

    /**
     * Suscribirse al newsletter
     */
    public function subscribeNewsletter(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|max:255'
        ]);

        // Aquí puedes implementar la lógica para guardar el email
        // Por ejemplo, guardarlo en la base de datos o enviarlo a un servicio externo

        return response()->json([
            'success' => true,
            'message' => 'Te has suscrito exitosamente al newsletter'
        ]);
    }
} 