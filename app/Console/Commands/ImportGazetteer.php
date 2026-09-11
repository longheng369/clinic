<?php

namespace App\Console\Commands;

use App\Imports\GazetteerImport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Maatwebsite\Excel\Facades\Excel;

class ImportGazetteer extends Command
{
    protected $signature = 'app:import-gazetteer';

    protected $description = 'Import gazetteer spreadsheets from storage/app/gazetteer';

    public function handle(): int
    {
        $path = storage_path('app/gazetteer');

        if (! File::exists($path)) {
            $this->error('Gazetteer directory not found: ' . $path);

            return self::FAILURE;
        }

        $files = File::files($path);

        foreach ($files as $file) {
            try {
                $this->info('Importing: ' . $file->getFilename());

                Excel::import(new GazetteerImport(), $file->getPathname());
            } catch (\Throwable $throwable) {
                $this->error('Failed: ' . $file->getFilename());
                $this->error($throwable->getMessage());
            }
        }

        $this->info('All gazetteer files imported successfully.');

        return self::SUCCESS;
    }
}
