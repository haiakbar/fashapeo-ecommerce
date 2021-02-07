<?php

namespace App\Listeners;

use App\Events\TransactionDenied;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class TransactionDeniedNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  TransactionDenied  $event
     * @return void
     */
    public function handle(TransactionDenied $event)
    {
        //
    }
}