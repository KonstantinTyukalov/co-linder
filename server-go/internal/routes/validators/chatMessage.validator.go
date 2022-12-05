package validators

import (
	validator "github.com/go-playground/validator"
)

type ChatMessageValidator struct {
	Validator *validator.Validate
}

func (cv *ChatMessageValidator) Validate(i interface{}) error {
	if err := cv.Validator.Struct(i); err != nil {
		return err
	}
	return nil
}
