export type Severity = '重篤' | '中程度' | '軽度'
export type BloodType = 'A型' | 'B型' | 'O型' | 'AB型' | '不明'

export type VisibilityLevel = 'public' | 'locked'

export type FieldVisibility = {
  birthdate: VisibilityLevel
  allergies: VisibilityLevel
  conditions: VisibilityLevel
  epipen_location: VisibilityLevel
  medications: VisibilityLevel
  emergency_contacts: VisibilityLevel
  doctors: VisibilityLevel
}

// 保育園などスタッフ認証の仕組みがあるタグにおける、これまでの挙動（決め打ちの公開/鍵付き）と
// 同じ結果になるデフォルト値。マイグレーション未適用の古いレコードのフォールバックにも使う。
export const DEFAULT_FIELD_VISIBILITY: FieldVisibility = {
  birthdate: 'locked',
  allergies: 'public',
  conditions: 'public',
  epipen_location: 'locked',
  medications: 'locked',
  emergency_contacts: 'locked',
  doctors: 'locked',
}

export const VISIBILITY_FIELD_LABELS: Record<keyof FieldVisibility, string> = {
  birthdate: '🎂 生年月日',
  allergies: '⚠️ アレルギー情報',
  conditions: '🫀 持病・既往歴',
  epipen_location: '💉 エピペンの保管場所',
  medications: '💊 持薬・医療器具',
  emergency_contacts: '📞 緊急連絡先',
  doctors: '🏥 かかりつけ医',
}

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
  is_lost: boolean
  field_visibility: FieldVisibility
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

export type Group = {
  id: string
  nursery_id: string
  name: string
  created_at: string
}

export type Message = {
  id: string
  nursery_id: string
  title: string
  body: string
  send_to: 'all' | 'groups'
  group_ids: string[]
  recipient_count: number
  sent_at: string
  created_at: string
}

export type MessageRecipient = {
  id: string
  message_id: string
  parent_id: string
  email: string
}

export type MessageRead = {
  id: string
  message_id: string
  parent_id: string
  read_at: string
}