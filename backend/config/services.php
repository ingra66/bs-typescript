<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'mercadopago' => [
        'access_token' => env('MERCADOPAGO_ACCESS_TOKEN'),
        'public_key' => env('MERCADOPAGO_PUBLIC_KEY'),
        'environment' => env('MERCADOPAGO_ENVIRONMENT', 'sandbox'), // sandbox or production
        'webhook_url' => env('MERCADOPAGO_WEBHOOK_URL'),
        'notification_url' => env('MERCADOPAGO_NOTIFICATION_URL'),
        'back_urls' => [
            'success' => env('MERCADOPAGO_BACK_URLS_SUCCESS', env('APP_FRONTEND_URL') . '/payment/success'),
            'failure' => env('MERCADOPAGO_BACK_URLS_FAILURE', env('APP_FRONTEND_URL') . '/payment/failure'),
            'pending' => env('MERCADOPAGO_BACK_URLS_PENDING', env('APP_FRONTEND_URL') . '/payment/pending'),
        ],
    ],

];
