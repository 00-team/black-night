import { Field } from 'state'

interface Fieldset {
    name: string | null
    description: string | null
    fields: Field[]
}

interface BraceFormModel {
    fieldsets: Fieldset[]
    label: string | null
}

export { BraceFormModel }
