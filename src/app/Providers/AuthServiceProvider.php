<?php

namespace App\Providers;

use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('isAdmin', function($user) {
            return $user->type === 'admin';
        });

        Gate::define('isManager', function($user) {
            return $user->type === 'manager';
        });

        Gate::define('isUser', function($user) {
            return $user->type === 'user';
        });

        Gate::define('isDeveloper', function($user) {
            return $user->type === 'developer';
        });

        Passport::routes();
        //
    }
}
