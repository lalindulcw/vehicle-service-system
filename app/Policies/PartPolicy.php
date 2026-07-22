<?php

namespace App\Policies;

use App\Models\Part;
use App\Models\User;

class PartPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Service Advisor', 'Mechanic']);
    }

    public function view(User $user, Part $part): bool
    {
        return $user->hasAnyRole(['Admin', 'Service Advisor', 'Mechanic']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Service Advisor']);
    }

    public function update(User $user, Part $part): bool
    {
        return $user->hasAnyRole(['Admin', 'Service Advisor']);
    }

    public function delete(User $user, Part $part): bool
    {
        return $user->hasRole('Admin');
    }
}
