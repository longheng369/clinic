<?php

namespace App\Traits;

trait Autocompletable
{
    public static function autocompleteSearchable(): array
    {
        $model = new static();

        if (! property_exists(static::class, 'autocompleteSearchable')) {
            return $model->getFillable();
        }

        $property = new \ReflectionProperty(static::class, 'autocompleteSearchable');

        if ($property->isStatic()) {
            return static::$autocompleteSearchable;
        }

        return $model->autocompleteSearchable;
    }

    public function autocompleteLabel(): string
    {
        // Override in the model if you want a custom format.
        // Defaults to first fillable text-ish column, or falls back to id.
        $column = static::autocompleteSearchable()[0] ?? null;
        return $column ? (string) $this->{$column} : (string) $this->id;
    }
}
