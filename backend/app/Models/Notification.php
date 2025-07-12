<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'icon',
        'action_url',
        'action_text',
        'read_at',
        'is_important',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
        'is_important' => 'boolean',
    ];

    // Tipos de notificación
    const TYPE_ORDER_STATUS = 'order_status';
    const TYPE_PAYMENT_RECEIVED = 'payment_received';
    const TYPE_STOCK_ALERT = 'stock_alert';
    const TYPE_REVIEW_APPROVED = 'review_approved';
    const TYPE_COUPON_EXPIRING = 'coupon_expiring';
    const TYPE_SHIPPING_UPDATE = 'shipping_update';

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    public function scopeImportant($query)
    {
        return $query->where('is_important', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Métodos
    public function markAsRead()
    {
        $this->update(['read_at' => now()]);
    }

    public function markAsUnread()
    {
        $this->update(['read_at' => null]);
    }

    public function isRead()
    {
        return !is_null($this->read_at);
    }

    public function isUnread()
    {
        return is_null($this->read_at);
    }

    public function getTypeLabelAttribute()
    {
        return [
            self::TYPE_ORDER_STATUS => 'Estado de Pedido',
            self::TYPE_PAYMENT_RECEIVED => 'Pago Recibido',
            self::TYPE_STOCK_ALERT => 'Alerta de Stock',
            self::TYPE_REVIEW_APPROVED => 'Reseña Aprobada',
            self::TYPE_COUPON_EXPIRING => 'Cupón por Vencer',
            self::TYPE_SHIPPING_UPDATE => 'Actualización de Envío',
        ][$this->type] ?? $this->type;
    }

    public function getIconClassAttribute()
    {
        return [
            self::TYPE_ORDER_STATUS => 'fas fa-box',
            self::TYPE_PAYMENT_RECEIVED => 'fas fa-credit-card',
            self::TYPE_STOCK_ALERT => 'fas fa-exclamation-triangle',
            self::TYPE_REVIEW_APPROVED => 'fas fa-star',
            self::TYPE_COUPON_EXPIRING => 'fas fa-ticket-alt',
            self::TYPE_SHIPPING_UPDATE => 'fas fa-shipping-fast',
        ][$this->type] ?? 'fas fa-bell';
    }
} 