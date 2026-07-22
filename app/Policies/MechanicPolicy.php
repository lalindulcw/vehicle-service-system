<?php

namespace App\Policies;

use App\Models\Mechanic;
use App\Models\User;

class MechanicPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Service Advisor']);
    }

    public function view(User $user, Mechanic $mechanic): bool
    {
        return $user->hasAnyRole(['Admin', 'Service Advisor']);
    }

    public function create(User $user): bool
    {
        return $user->hasRole('Admin'); // Admin only CRUD
    }

    public function update(User $user, Mechanic $mechanic): bool
    {
        return $user->hasRole('Admin'); // Admin only CRUD
    }

    public function delete(User $user, Mechanic $mechanic): bool
    {
        return $user->hasRole('Admin'); // Admin only CRUD
    }
}
