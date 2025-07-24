'use client'

import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import PhoneInput from 'react-phone-number-input/input'
import { isValidPhoneNumber } from 'libphonenumber-js'

export function PhoneField() {
    const {
        register,
        setValue,
        trigger,
        watch,
        formState: { errors },
    } = useFormContext()

    const phone = watch('phone')

    return (
        <div className="space-y-2">
            <Label htmlFor="phone">Telefone Principal</Label>

            <PhoneInput
                country="BR"
                international
                withCountryCallingCode
                defaultCountry="BR"
                value={phone}
                onChange={(value) => {
                    setValue('phone', value || '')
                    trigger('phone')
                }}
                inputComponent={Input}
                placeholder="+55 (85) 99876-5432"
                id="phone"
                name="phone"
            />

            {errors.phone && (
                <p className="text-sm text-red-500">
                    {errors.phone.message?.toString()}
                </p>
            )}
        </div>
    )
}
