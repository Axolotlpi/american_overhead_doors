import {defineType, defineField} from 'sanity'

export const contactDetails = defineType({
  name: 'contactDetails',
  title: 'Contact Details',
  type: 'document',
  fields: [
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Public business number, displayed as entered. Leave blank to hide it.',
      validation: (rule) => rule.custom((value: string | undefined) => {
        if (!value?.trim()) return true
        return /^\+?[\d\s().-]+$/.test(value.trim()) && value.replace(/\D/g, '').length >= 7
          ? true
          : 'Enter a phone number using digits, spaces, parentheses, dashes and an optional leading +.'
      }),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: 'Public business email. Leave blank to hide it.',
      validation: (rule) => rule.custom((value: string | undefined) =>
        !value?.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
          ? true
          : 'Enter a valid email address.',
      ),
    }),
  ],
  preview: {prepare: () => ({title: 'Contact Details'})},
})
