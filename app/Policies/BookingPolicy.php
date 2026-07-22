<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Service Advisor', 'Mechanic']);
    }

    public function view(User $user, Booking $booking): bool
    {
        if ($user->hasRole('Mechanic')) {
            // Mechanic can only view if assigned to the booking
            return $booking->mechanic_id && $booking->mechanic->contact === $user->email; // wait, we mapped email to mechanic contact or user has relation.
            // Let's make it simpler: does user name match mechanic name or can we check if mechanic's contact contains email or name matches?
            // Actually, in the seeder, Mike Master Mechanic user has email 'mechanic@example.com' and name 'Mike Master Mechanic'.
            // Let's check if the mechanic name matches user name, or simply if they are a mechanic. For an assignment, let's allow mechanics to view any booking they are assigned to.
            // Let's find the mechanic matching this user email:
            // Since we seeded mechanic contact as contact details, we can check:
            // return $booking->mechanic && $booking->mechanic->name === $user->name;
            // Let's do that!
            return $booking->mechanic && $booking->mechanic->name === $user->name;
        }

        return $user->hasAnyRole(['Admin', 'Service Advisor']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Service Advisor']);
    }

    public function update(User $user, Booking $booking): bool
    {
        if ($user->hasRole('Mechanic')) {
            // Mechanic can only update if assigned to this booking
            return $booking->mechanic && $booking->mechanic->name === $user->name;
        }

        return $user->hasAnyRole(['Admin', 'Service Advisor']);
    }

    public function delete(User $user, Booking $booking): bool
    {
        return $user->hasRole('Admin');
    }
}
