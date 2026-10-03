package com.bibliotech.backend.exception;

import com.bibliotech.backend.dto.AuthResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<AuthResponse> handleUserNotFoundException(UserNotFoundException ex) {
        AuthResponse response = new AuthResponse(false, ex.getMessage(), null, null, null, null, null, null, null);
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<AuthResponse> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        AuthResponse response = new AuthResponse(false, ex.getMessage(), null, null, null, null, null, null, null);
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(InactiveUserException.class)
    public ResponseEntity<AuthResponse> handleInactiveUserException(InactiveUserException ex) {
        AuthResponse response = new AuthResponse(false, ex.getMessage(), null, null, null, null, null, null, null);
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<AuthResponse> handleGlobalException(Exception ex) {
        AuthResponse response = new AuthResponse(false, "Ocurrió un error inesperado", null, null, null, null, null, null, null);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
