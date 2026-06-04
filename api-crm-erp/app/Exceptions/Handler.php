<?php

namespace App\Exceptions;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->renderable(function(ModelNotFoundException $e, $request)
        {
            if($request->is('api/*'))
                {
                    return response()->json(
                        [
                            'status' => 'error',
                            'message' => 'Resource not found.',
                             
                        ],
                        404
                    );
                }
        });

        $this->renderable(function(ValidationException $e, $request)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error.',
                'errors' => $e->errors()
            ], 422);
        });

        $this->renderable(function(AccessDeniedHttpException $e, $request)
        {
            return response()->json(
                [
                    'status' => 'error',
                    'message' => 'You have not permissions to continue.',

                ],
                403);
        });
    }
}
