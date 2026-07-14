<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HelpController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('help/index');
    }
}
