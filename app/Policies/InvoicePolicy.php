<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Service Advisor']);
    }

    public function view(User $user, Invoice $invoice): bool
    {
        return $user->hasAnyRole(['Admin', 'Service Advisor']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Service Advisor']);
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return $user->hasAnyRole(['Admin', 'Service Advisor']);
    }

    public function delete(User $user, Invoice $invoice): bool
    {
        return $user->hasRole('Admin');
    }
}
