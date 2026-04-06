import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="text-center text-xs text-[#7A8E80] py-8 space-x-4 border-t border-[#E0EAE2] mt-8">
      <Link href="/terms" className="underline hover:text-[#1A6640]">利用規約</Link>
      <Link href="/privacy" className="underline hover:text-[#1A6640]">プライバシーポリシー</Link>
      <span>© 2025 おまもりタグ</span>
    </footer>
  )
}