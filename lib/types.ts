export type Severity = '重篤' | '中程度' | '軽度'
export type BloodType = 'A型' | 'B型' | 'O型' | 'AB型' | '不明'

export type Child = {
  id: string
  nursery_id: string | null
  parent_id: string | null
  display_name: string
  full_name: string | null
  kana: string | null
  age: string
  birthdate: string | null
  blood_type: BloodType | null
  has_epipen: boolean
  epipen_location: string | null
  slug: string
  created_at: string
  updated_at: string
}

export type Allergy = {
  id: string
  child_id: string
  name: string
  severity: Severity
  action: string
  sort_order: number
}

export type Condition = {
  id: string
  child_id: string
  name: string
  note: string
  sort_order: number
}

export type Medication = {
  id: string
  child_id: string
  name: string
  location: string
  dosage: string
  sort_order: number
}

export type EmergencyContact = {
  id: string
  child_id: string
  label: string
  phone: string
  relation: string
  sort_order: number
}

export type Doctor = {
  id: string
  child_id: string
  name: string
  phone: string
  address: string
  note: string
}

export type ChildFull = Child & {
  allergies: Allergy[]
  conditions: Condition[]
  medications: Medication[]
  emergency_contacts: EmergencyContact[]
  doctors: Doctor[]
}