package validators

import (
	validator "github.com/go-playground/validator"
)

type FlatCommentValidator struct {
	Validator *validator.Validate
}

func (cv *FlatCommentValidator) Validate(i interface{}) error {
	if err := cv.Validator.Struct(i); err != nil {
		return err
	}
	return nil
}
