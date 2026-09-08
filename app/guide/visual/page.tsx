import type { Metadata } from 'next'
import Link from 'next/link'
import { Zen_Maru_Gothic, Noto_Sans_JP } from 'next/font/google'

const zenMaru = Zen_Maru_Gothic({
  weight: '900',
  variable: '--font-zen-maru',
})

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '700', '900'],
  variable: '--font-noto-sans-jp',
})

export const metadata: Metadata = {
  title: '使い方ガイド｜おまもりタグ',
  description: 'NFCタグの発行から実際の情報表示まで、実際の画面を再現しながら手順を紹介する保護者向けガイド。',
}

export default function VisualGuidePage() {
  return (
    <main className={`${zenMaru.variable} ${notoSansJP.variable} guide-visual`}>
      <style>{`

  .guide-visual{
    box-sizing:border-box;
    --paper:#F6F7F1;
    --panel:#FFFFFF;
    --ink:#1B2A20;
    --muted:#66786C;
    --line:#DDE4DA;
    --accent:#1A6640;
    --accent-soft:#E6F0EA;
    --accent-ink:#0F4A2C;
    --amber:#8A5A12;
    --amber-soft:#F4EBDA;
    --alert:#A83A34;
    --alert-soft:#F6E7E5;
    --num:#C9D6C7;
    --shadow: 0 24px 48px -28px rgba(20,40,28,.35);
    background:var(--paper);
    color:var(--ink);
    font-family:var(--font-noto-sans-jp), sans-serif;
    line-height:1.75;
  }
  .guide-visual *{box-sizing:border-box;}
  .guide-visual h1,.guide-visual h2,.guide-visual h3{
    font-family:var(--font-zen-maru), var(--font-noto-sans-jp), sans-serif;
    text-wrap:balance;
    color:var(--ink);
    margin:0;
  }
  .guide-visual .wrap{max-width:1040px;margin:0 auto;padding:32px 24px 96px;}
  .guide-visual__topbar{max-width:1040px;margin:0 auto;padding:24px 24px 0;}
  .guide-visual__back{font-size:13px;font-weight:700;color:var(--accent-ink,#0F4A2C);text-decoration:none;}
  .guide-visual__back:hover{text-decoration:underline;}

  /* ── masthead ── */
  .mast{max-width:640px;margin:0 auto 64px;text-align:center;}
  .mast__eyebrow{
    display:inline-flex;align-items:center;gap:8px;
    font-size:12px;font-weight:700;letter-spacing:.14em;
    color:var(--accent-ink);background:var(--accent-soft);
    padding:6px 14px;border-radius:999px;margin-bottom:20px;
  }
  .mast__eyebrow .dot{width:6px;height:6px;border-radius:50%;background:var(--accent);}
  .mast h1{font-size:clamp(28px,4vw,38px);font-weight:900;margin-bottom:14px;}
  .mast p{color:var(--muted);font-size:15px;max-width:520px;margin:0 auto;}
  .mast__note{
    margin-top:28px;display:inline-flex;align-items:center;gap:10px;
    font-size:12.5px;color:var(--muted);border:1px solid var(--line);
    border-radius:12px;padding:10px 16px;background:var(--panel);
  }

  /* ── steps ── */
  .steps{display:flex;flex-direction:column;}
  .step{
    display:grid;grid-template-columns:minmax(0,1fr) 336px;
    gap:40px;padding:52px 0;border-top:1px solid var(--line);
    align-items:start;
  }
  .step:first-child{border-top:1px solid var(--line);}
  .step__num{
    font-family:var(--font-zen-maru), sans-serif;font-weight:900;
    font-size:56px;line-height:1;color:var(--num);
    -webkit-text-stroke:1px var(--line);
    display:block;margin-bottom:6px;
  }
  .step__kicker{
    font-size:11.5px;font-weight:700;letter-spacing:.1em;
    color:var(--accent-ink);text-transform:uppercase;margin-bottom:8px;
  }
  .step h2{font-size:23px;font-weight:900;margin-bottom:14px;}
  .step__lede{color:var(--muted);font-size:14.5px;max-width:58ch;margin-bottom:20px;}
  .step__lede strong{color:var(--ink);font-weight:700;}

  .callouts{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;}
  .callouts li{display:flex;gap:12px;align-items:flex-start;font-size:13.5px;color:var(--ink);}
  .callouts .dot{
    flex-shrink:0;width:22px;height:22px;border-radius:50%;
    background:var(--alert);color:#fff;font-weight:900;font-size:11.5px;
    display:flex;align-items:center;justify-content:center;
    font-family:var(--font-zen-maru), sans-serif;
  }
  .callouts .txt{padding-top:2px;color:var(--muted);}
  .callouts .txt strong{color:var(--ink);font-weight:700;}

  .step__aside{
    background:var(--amber-soft);border:1px solid var(--line);
    border-radius:12px;padding:12px 14px;margin-top:18px;
    font-size:12.5px;color:var(--amber);font-weight:700;
    display:flex;gap:8px;
  }
  .step__aside.good{background:var(--accent-soft);color:var(--accent-ink);}

  /* ── flow diagram (step 01: no single screen to show) ── */
  .flow{
    width:296px;display:flex;align-items:center;justify-content:center;
    flex-wrap:wrap;gap:6px;padding:20px 10px;
  }
  .flow__node{
    background:var(--panel);border:1px solid var(--line);border-radius:16px;
    padding:16px 10px;text-align:center;width:120px;box-shadow:var(--shadow);
  }
  .flow__node .ic{font-size:28px;margin-bottom:8px;}
  .flow__node .lb{font-size:11.5px;font-weight:800;color:var(--ink);line-height:1.4;}
  .flow__node .sub{font-size:10px;color:var(--muted);margin-top:3px;}
  .flow__arrow{color:var(--num);font-size:20px;flex-shrink:0;}

  /* ── device mockup ── */
  .device-col{display:flex;flex-direction:column;align-items:center;gap:14px;}
  .device{
    width:296px;background:#131614;border-radius:38px;
    padding:9px 9px 20px;box-shadow:var(--shadow);position:relative;
  }
  .device::before{
    content:"";position:absolute;top:9px;left:50%;transform:translateX(-50%);
    width:74px;height:16px;background:#131614;border-radius:0 0 12px 12px;z-index:2;
  }
  .device__screen{
    position:relative;background:#F4F7F5;border-radius:28px;overflow:hidden;
    min-height:560px;font-family:var(--font-noto-sans-jp), sans-serif;
    font-size:11px;color:#0E1A12;
  }
  .status{
    display:flex;justify-content:space-between;align-items:center;
    padding:10px 18px 2px;font-size:11px;font-weight:700;color:#0E1A12;
    font-variant-numeric:tabular-nums;
  }
  .screen-body{padding:12px 14px 18px;}

  .app-card{background:#fff;border:1px solid #E0EAE2;border-radius:14px;padding:12px;}
  .app-card + .app-card{margin-top:8px;}
  .app-hd{padding:9px 12px;border-radius:10px 10px 0 0;margin:-12px -12px 10px;font-size:9.5px;font-weight:900;letter-spacing:.06em;}
  .app-btn{border-radius:11px;padding:9px;text-align:center;font-weight:800;font-size:10.5px;}
  .app-btn.primary{background:#1A6640;color:#fff;}
  .app-btn.outline{background:#fff;border:1px solid #E0EAE2;color:#0E1A12;}
  .app-btn.outline.blue{color:#1A50A0;border-color:#A0BCE8;background:#EBF0FA;}
  .app-btn.outline.green{color:#1A6640;border-color:#B8D9C8;background:#E6F4EC;}
  .app-btn.alert{background:#B83030;color:#fff;}
  .app-row{display:flex;gap:6px;}
  .app-pill{border-radius:999px;padding:2.5px 8px;font-weight:800;font-size:9px;display:inline-block;}
  .app-pill.green{background:#E6F4EC;color:#1A6640;border:1px solid #B8D9C8;}
  .app-pill.amber{background:#FDF5E4;color:#926010;border:1px solid #E8C880;}
  .app-pill.blue{background:#EBF0FA;color:#1A50A0;border:1px solid #A0BCE8;}
  .app-pill.red{background:#FCEAEA;color:#B83030;border:1px solid #E8AAAA;}
  .app-label{font-size:9px;font-weight:900;color:#7A8E80;text-transform:uppercase;letter-spacing:.05em;}
  .app-input{border:1px solid #E0EAE2;border-radius:9px;padding:7px 9px;font-size:10.5px;color:#0E1A12;background:#fff;margin-top:3px;}
  .app-input.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9px;word-break:break-all;background:#F4F7F5;}
  .app-h1{font-weight:900;font-size:14px;color:#0E1A12;}
  .app-muted{color:#7A8E80;font-size:10px;}
  .app-tab{flex-shrink:0;padding:5px 9px;border-radius:9px;font-size:9px;font-weight:800;}
  .app-tab.on{background:#1A6640;color:#fff;}
  .app-tab.off{background:#fff;color:#7A8E80;border:1px solid #E0EAE2;}
  .toggle{width:34px;height:18px;border-radius:999px;position:relative;flex-shrink:0;}
  .toggle.on{background:#B83030;}
  .toggle.off{background:#D0D8D4;}
  .toggle span{position:absolute;top:1.5px;width:15px;height:15px;border-radius:50%;background:#fff;}
  .toggle.on span{right:1.5px;}
  .toggle.off span{left:1.5px;}

  .pin{
    position:absolute;width:22px;height:22px;border-radius:50%;
    background:var(--alert,#A83A34);color:#fff;font-weight:900;font-size:11px;
    display:flex;align-items:center;justify-content:center;
    font-family:var(--font-zen-maru), sans-serif;
    box-shadow:0 0 0 3px rgba(255,255,255,.85), 0 4px 10px rgba(0,0,0,.35);
    z-index:5;
  }
  .device-caption{font-size:11.5px;color:var(--muted);text-align:center;max-width:260px;}

  .qr-fake{
    width:96px;height:96px;margin:0 auto;border-radius:6px;overflow:hidden;
    display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);
    border:6px solid #fff;background:#fff;
  }
  .qr-fake i{background:#0E1A12;}
  .qr-fake i.o{background:transparent;}

  @media (max-width:820px){
    .step{grid-template-columns:1fr;gap:26px;}
    .device{margin:0 auto;}
  }

  /* ── closing ── */
  .closing{
    margin-top:20px;padding-top:44px;border-top:1px solid var(--line);
    display:grid;grid-template-columns:1fr 1fr;gap:24px;
  }
  .closing .card{
    background:var(--panel);border:1px solid var(--line);border-radius:16px;
    padding:22px 24px;
  }
  .closing h3{font-size:15px;font-weight:900;margin-bottom:8px;}
  .closing p{font-size:13px;color:var(--muted);margin:0;}
  .closing a{color:var(--accent-ink);font-weight:700;}
  @media (max-width:640px){.closing{grid-template-columns:1fr;}}

      `}</style>

      <div className="guide-visual__topbar">
        <Link href="/guide" className="guide-visual__back">← 使い方ガイドへ戻る</Link>
      </div>

<div className="wrap">

  <header className="mast">
    <span className="mast__eyebrow"><span className="dot"></span>おまもりタグ　保護者向け</span>
    <h1>使い方ガイド</h1>
    <p>書き込み済みのタグを購入した場合も、自分でNFCタグ・QRコードを用意する場合も、実際の画面を見ながら進められます。すべて入力し終えなくても、途中の状態でいつでも保存されます。</p>
    <div className="mast__note">📱 このガイド内の画面はアプリの実際の見た目を再現したイメージです（タップはできません）</div>
  </header>

  <div className="steps">

    {/* STEP 1 */}
    <section className="step">
      <div>
        <span className="step__num">01</span>
        <div className="step__kicker">はじめの一歩</div>
        <h2>タグをかざす、または自分でログインする</h2>
        <p className="step__lede">すでにNFC書き込み済みのタグを<strong>購入した場合</strong>は、スマホをタグにかざすだけで自動的に「お子さまの登録」画面が開きます。URLを自分で入力・設定する必要はありません。ご自身でタグ／QRコードを用意する場合は、②のログインから始めてください。</p>
        <ol className="callouts">
          <li><span className="dot">1</span><span className="txt">タグをかざすと自動で <strong>お子さまの登録画面</strong>（ステップ3）が開きます</span></li>
          <li><span className="dot">2</span><span className="txt">ログインがまだの場合は、その場で <strong>②ログイン画面</strong> に移ります</span></li>
        </ol>
        <div className="step__aside good">💡 先にログイン（またはアカウント作成）だけ済ませてから、タグをかざすと入力し直しがなくスムーズです。</div>
      </div>
      <div className="device-col">
        <div className="flow">
          <div className="flow__node"><div className="ic">🏷️</div><div className="lb">タグを<br/>かざす</div><div className="sub">/tag/xxxx</div></div>
          <div className="flow__arrow">→</div>
          <div className="flow__node"><div className="ic">🔑</div><div className="lb">ログイン／<br/>新規登録</div><div className="sub">未ログイン時のみ</div></div>
          <div className="flow__arrow">→</div>
          <div className="flow__node"><div className="ic">📝</div><div className="lb">お子さまを<br/>登録</div><div className="sub">ステップ3</div></div>
        </div>
        <p className="device-caption">購入した書き込み済みタグをかざした場合の流れ</p>
      </div>
    </section>

    {/* STEP 2 */}
    <section className="step">
      <div>
        <span className="step__num">02</span>
        <div className="step__kicker">アカウント</div>
        <h2>保護者としてログインする</h2>
        <p className="step__lede">Googleアカウントをお持ちなら一番早く、お持ちでない場合はメールアドレスで新規登録できます。すでにアカウントがあれば、いつでもここからログインし直せます。</p>
        <ol className="callouts">
          <li><span className="dot">1</span><span className="txt">初めて使う方は<strong>「✉️ 新規登録（メール）」</strong>を選びます</span></li>
          <li><span className="dot">2</span><span className="txt">確認メールが届くので、本文のリンクを開いて登録を完了させます</span></li>
        </ol>
      </div>
      <div className="device-col">
        <div className="device">
          <div className="device__screen">
            <div className="status"><span>9:41</span><span>●●●</span></div>
            <div className="screen-body" style={{textAlign: 'center', paddingTop: '34px'}}>
              <div style={{fontSize: '34px', marginBottom: '10px'}}>🔑</div>
              <div className="app-h1" style={{fontSize: '16px'}}>保護者ログイン</div>
              <div className="app-muted" style={{margin: '6px 0 22px'}}>ログイン方法を選択してください</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '9px', textAlign: 'left'}}>
                <div className="app-btn outline" style={{display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'}}>
                  <span style={{fontSize: '12px'}}>🌐</span> Googleでログイン
                </div>
                <div className="app-btn primary" style={{position: 'relative'}}>📧 メールアドレスでログイン
                  <span className="pin" style={{top: '-11px', right: '-11px'}}>1</span>
                </div>
                <div className="app-btn outline green">✉️ 新規登録（メール）</div>
              </div>
              <div className="app-muted" style={{marginTop: '26px'}}>🔒 SSL暗号化通信で安全に管理されます</div>
            </div>
          </div>
        </div>
        <p className="device-caption">保護者ログイン画面（/login）</p>
      </div>
    </section>

    {/* STEP 3 */}
    <section className="step">
      <div>
        <span className="step__num">03</span>
        <div className="step__kicker">プロフィール登録</div>
        <h2>お子さまを登録する</h2>
        <p className="step__lede">呼び名と年齢だけでまず登録できます。保育園などから<strong>施設コード</strong>を配布されている場合のみ入力してください。個人利用なら空欄のままで問題ありません。</p>
        <ol className="callouts">
          <li><span className="dot">1</span><span className="txt">「呼び名」「年齢」を入力（必須はここだけ）</span></li>
          <li><span className="dot">2</span><span className="txt">規約に同意して<strong>「登録する」</strong>をタップ</span></li>
        </ol>
        <div className="step__aside good">✅ タグをかざして開いた場合、「登録する」を押した瞬間にこのタグとお子さまが自動的に紐づきます。あとから改めてタグに何かを書き込む必要はありません（ステップ6は不要です）。</div>
        <div className="step__aside">💡 詳しいアレルギー・持病・緊急連絡先などは、次のステップで後からいくらでも追加・修正できます。</div>
      </div>
      <div className="device-col">
        <div className="device">
          <div className="device__screen">
            <div className="status"><span>9:41</span><span>●●●</span></div>
            <div className="screen-body">
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                <div style={{width: '22px', height: '22px', borderRadius: '7px', border: '1px solid #E0EAE2', background: '#fff'}}></div>
                <div className="app-h1">新しく登録</div>
              </div>
              <div style={{background: '#E6F4EC', border: '1px solid #B8D9C8', borderRadius: '10px', padding: '7px 9px', marginBottom: '8px', fontSize: '9px', color: '#1A6640', display: 'flex', gap: '5px'}}>
                <span>🏷️</span><span>おまもりタグの初期設定です。下の情報を入力して「登録する」を押すと、このタグで使えるようになります。</span>
              </div>
              <div className="app-card">
                <div className="app-label">呼び名 *</div>
                <div className="app-input">ゆき</div>
                <div className="app-label" style={{marginTop: '9px'}}>年齢 *</div>
                <div className="app-input" style={{position: 'relative'}}>5歳<span className="pin" style={{top: '-9px', right: '-9px', width: '18px', height: '18px', fontSize: '10px'}}>1</span></div>
              </div>
              <div className="app-card">
                <div className="app-label" style={{marginBottom: '4px'}}>🏫 施設との紐づけ（任意）</div>
                <div className="app-muted">施設コードをお持ちの場合のみ</div>
              </div>
              <div className="app-card" style={{display: 'flex', gap: '8px', alignItems: 'flex-start'}}>
                <div style={{width: '16px', height: '16px', borderRadius: '5px', background: '#1A6640', flexShrink: '0', marginTop: '1px'}}></div>
                <div className="app-muted" style={{fontSize: '9.5px'}}>利用規約およびプライバシーポリシーに同意します</div>
              </div>
              <div className="app-btn primary" style={{marginTop: '14px', position: 'relative'}}>登録する
                <span className="pin" style={{top: '-10px', right: '-10px'}}>2</span>
              </div>
            </div>
          </div>
        </div>
        <p className="device-caption">新規登録画面（/register）※タグ経由で開いた場合の案内表示つき</p>
      </div>
    </section>

    {/* STEP 4 */}
    <section className="step">
      <div>
        <span className="step__num">04</span>
        <div className="step__kicker">マイページ</div>
        <h2>マイページから編集を開く</h2>
        <p className="step__lede">登録が終わるとマイページにお子さまのカードが表示されます。ここから情報の編集や、自分で用意するタグ用のURL発行に進みます。</p>
        <ol className="callouts">
          <li><span className="dot">1</span><span className="txt"><strong>「編集する」</strong>でアレルギー・持病・緊急連絡先などを入力</span></li>
          <li><span className="dot">2</span><span className="txt"><strong>「🏷️ NFCタグ / QR」</strong>は、自分でタグ・QRを用意する場合だけ使います（ステップ6）</span></li>
        </ol>
      </div>
      <div className="device-col">
        <div className="device">
          <div className="device__screen">
            <div className="status"><span>9:41</span><span>●●●</span></div>
            <div className="screen-body">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                <div><div className="app-muted" style={{fontSize: '9px'}}>ログイン中</div><div style={{fontWeight: '800', fontSize: '11px'}}>yuka@example.com</div></div>
                <div className="app-btn outline" style={{padding: '5px 9px', fontSize: '9px'}}>ログアウト</div>
              </div>
              <div style={{background: '#E6F4EC', border: '1px solid #B8D9C8', borderRadius: '10px', padding: '8px 10px', marginBottom: '10px', fontSize: '9px', color: '#1A6640'}}>
                🏷️ おまもりタグは緊急時の「サブ」として活用するものです
              </div>
              <div className="app-label" style={{marginBottom: '6px'}}>登録済みの情報</div>
              <div className="app-card" style={{position: 'relative'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                  <div style={{width: '34px', height: '34px', borderRadius: '9px', background: '#E6F4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'}}>🛡️</div>
                  <div><div style={{fontWeight: '900', fontSize: '11.5px'}}>ゆき</div><div className="app-muted">5歳</div></div>
                </div>
                <div className="app-row">
                  <div className="app-btn outline green" style={{flex: '1', padding: '6px', fontSize: '9px'}}>情報を見る</div>
                  <div className="app-btn outline" style={{flex: '1', padding: '6px', fontSize: '9px', position: 'relative'}}>編集する<span className="pin" style={{top: '-9px', right: '-9px', width: '16px', height: '16px', fontSize: '9px'}}>1</span></div>
                </div>
                <div className="app-btn outline blue" style={{marginTop: '6px', padding: '6px', fontSize: '9px', position: 'relative'}}>🏷️ NFCタグ / QR<span className="pin" style={{top: '-9px', right: '-9px', width: '16px', height: '16px', fontSize: '9px'}}>2</span></div>
              </div>
              <div className="app-btn primary" style={{marginTop: '12px'}}>＋ 新しく登録する</div>
            </div>
          </div>
        </div>
        <p className="device-caption">マイページ（/dashboard）</p>
      </div>
    </section>

    {/* STEP 5 */}
    <section className="step">
      <div>
        <span className="step__num">05</span>
        <div className="step__kicker">情報入力と公開範囲</div>
        <h2>入力して、公開する項目を選ぶ</h2>
        <p className="step__lede">タブを切り替えながら、アレルギー・持薬・緊急連絡先などを必要な範囲だけ入力します。各項目についている<strong>🔓/🔒バッジ</strong>で、その項目を誰に見せるか選べます。</p>
        <ol className="callouts">
          <li><span className="dot">1</span><span className="txt"><strong>🔓 公開</strong>＝タグをかざした人なら誰でも見られる</span></li>
          <li><span className="dot">2</span><span className="txt"><strong>🔒 非表示／鍵付き</strong>＝自分（施設と紐づけていればスタッフ認証した人）だけ見られる。バッジを押すとその場で切り替わります</span></li>
        </ol>
      </div>
      <div className="device-col">
        <div className="device">
          <div className="device__screen">
            <div className="status"><span>9:41</span><span>●●●</span></div>
            <div className="screen-body">
              <div className="app-h1" style={{marginBottom: '8px'}}>情報を編集</div>
              <div className="app-row" style={{flexWrap: 'wrap', gap: '5px', marginBottom: '9px'}}>
                <div className="app-tab on">基本情報</div>
                <div className="app-tab off">アレルギー</div>
                <div className="app-tab off">持薬</div>
                <div className="app-tab off">連絡先</div>
              </div>
              <div className="app-card">
                <div className="app-label">表示名</div>
                <div className="app-input">ゆき</div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '9px'}}>
                  <div className="app-label">フルネーム</div>
                  <div className="app-pill amber" style={{position: 'relative'}}>🔒 非表示<span className="pin" style={{top: '-10px', right: '-10px', width: '16px', height: '16px', fontSize: '9px'}}>1</span></div>
                </div>
                <div className="app-input">－</div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '9px'}}>
                  <div className="app-label">緊急連絡先</div>
                  <div className="app-pill green">🔓 公開</div>
                </div>
                <div className="app-input">母：090-xxxx-xxxx</div>
                <div style={{display: 'flex', gap: '8px', marginTop: '11px'}}>
                  <div className="app-btn alert" style={{flex: '1', padding: '7px', fontSize: '9.5px'}}>💉 あり</div>
                  <div className="app-btn outline" style={{flex: '1', padding: '7px', fontSize: '9.5px'}}>なし</div>
                </div>
              </div>
              <div className="app-card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px'}}>
                <div>
                  <div style={{fontWeight: '900', fontSize: '10.5px', color: '#5A6E62'}}>🔒 紛失モード</div>
                  <div className="app-muted" style={{fontSize: '9px', marginTop: '2px'}}>ONにすると公開URLが一時的に無効化されます</div>
                </div>
                <div className="toggle off"><span></span></div>
              </div>
            </div>
          </div>
        </div>
        <p className="device-caption">編集画面（/edit/[id]）— 基本情報タブ</p>
      </div>
    </section>

    {/* STEP 6 */}
    <section className="step">
      <div>
        <span className="step__num">06</span>
        <div className="step__kicker">タグの準備（自分で用意する場合のみ）</div>
        <h2>NFCタグ・QRコードを自分で用意する</h2>
        <p className="step__lede"><strong>書き込み済みのタグを購入した方はこの手順は不要です</strong>（ステップ3で自動的に紐づいています）。空のNFCタグを自分で書き込みたい方、追加のタグやQRコードを増やしたい方はここから発行します。</p>
        <ol className="callouts">
          <li><span className="dot">1</span><span className="txt"><strong>「📋 URLをコピー」</strong>してNFC Toolsアプリなどで書き込む</span></li>
          <li><span className="dot">2</span><span className="txt">NFCタグが無い場合は<strong>「📱 QRコード」</strong>を印刷するだけでもOK</span></li>
        </ol>
        <div className="step__aside">⚠️ URLの再発行はタグの書き直しが必要なので、紛失以外では基本的に不要です。</div>
      </div>
      <div className="device-col">
        <div className="device">
          <div className="device__screen">
            <div className="status"><span>9:41</span><span>●●●</span></div>
            <div className="screen-body">
              <div className="app-h1" style={{fontSize: '12.5px', marginBottom: '8px'}}>NFCタグ / QRコード</div>
              <div className="app-card">
                <div className="app-label" style={{marginBottom: '5px'}}>🏷️ 一般向けURL</div>
                <div className="app-input mono">https://omamori-tag.app/kid/a1b2c3…</div>
                <div className="app-row" style={{marginTop: '8px'}}>
                  <div className="app-btn primary" style={{flex: '1', padding: '7px', fontSize: '9.5px', position: 'relative'}}>📋 URLをコピー<span className="pin" style={{top: '-9px', right: '-9px', width: '16px', height: '16px', fontSize: '9px'}}>1</span></div>
                  <div className="app-btn outline green" style={{flex: '1', padding: '7px', fontSize: '9.5px', position: 'relative'}}>📱 QRコード<span className="pin" style={{top: '-9px', right: '-9px', width: '16px', height: '16px', fontSize: '9px'}}>2</span></div>
                </div>
              </div>
              <div className="app-card" style={{textAlign: 'center'}}>
                <div className="app-label" style={{marginBottom: '9px'}}>QRコードプレビュー</div>
                <div className="qr-fake" aria-hidden="true">
                  <i></i><i className="o"></i><i></i><i></i><i className="o"></i><i></i><i></i><i className="o"></i>
                  <i></i><i className="o"></i><i className="o"></i><i className="o"></i><i></i><i className="o"></i><i className="o"></i><i></i>
                  <i></i><i className="o"></i><i></i><i></i><i className="o"></i><i className="o"></i><i className="o"></i><i></i>
                  <i className="o"></i><i className="o"></i><i></i><i className="o"></i><i></i><i className="o"></i><i></i><i className="o"></i>
                  <i></i><i className="o"></i><i className="o"></i><i></i><i className="o"></i><i></i><i className="o"></i><i></i>
                  <i className="o"></i><i></i><i className="o"></i><i className="o"></i><i></i><i className="o"></i><i className="o"></i><i></i>
                  <i></i><i className="o"></i><i></i><i className="o"></i><i></i><i></i><i className="o"></i><i className="o"></i>
                  <i></i><i></i><i className="o"></i><i></i><i className="o"></i><i className="o"></i><i></i><i></i>
                </div>
                <div className="app-muted" style={{marginTop: '8px'}}>ゆき の健康情報QRコード</div>
              </div>
              <div style={{background: '#EBF0FA', border: '1px solid #A0BCE8', borderRadius: '12px', padding: '9px 10px'}}>
                <div style={{fontWeight: '900', color: '#1A50A0', fontSize: '9.5px', marginBottom: '5px'}}>📖 書き込み手順</div>
                <div style={{color: '#1A50A0', fontSize: '9px', lineHeight: '1.6'}}>
                  ① NFC Toolsをインストール<br/>② 「書き込み」→「URL」<br/>③ 上記URLを入力<br/>④ タグにかざして書き込み
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="device-caption">NFCタグ / QRコード画面（/nfc/[id]）</p>
      </div>
    </section>

    {/* STEP 7 */}
    <section className="step">
      <div>
        <span className="step__num">07</span>
        <div className="step__kicker">最終確認</div>
        <h2>実際に読み取って確認する</h2>
        <p className="step__lede">タグをかざすか、コピーしたURL・QRコードを開いて、意図した通りに表示されるか確認しましょう。この画面は誰でも見られるので、以下の3点だけ確認してください。</p>
        <ol className="callouts">
          <li><span className="dot">1</span><span className="txt"><strong>文字サイズ</strong>：右上のボタンで「あ→あ+→あ++」の3段階に切り替わります。高齢のご家族や慌てている発見者にも読みやすくできます</span></li>
          <li><span className="dot">2</span><span className="txt"><strong>🚨 緊急通知</strong>：発見者や周りの人がこのボタンを押すと、位置情報と一言メッセージ（任意）だけが保護者に届きます。電話番号や住所など個人情報は一切表示されません。連続送信の誤操作を防ぐため、1分に1回までの制限つきです</span></li>
          <li><span className="dot">3</span><span className="txt"><strong>👨‍👩‍👧 保護者の方へ</strong>：ログイン中で自分の子のタグなら「編集する」へ、未ログインなら「保護者ログイン」へ進める案内が画面下に表示されます</span></li>
        </ol>
      </div>
      <div className="device-col">
        <div className="device">
          <div className="device__screen">
            <div className="status"><span>9:41</span><span>●●●</span></div>
            <div style={{background: '#B83030', color: '#fff', textAlign: 'center', padding: '5px', fontSize: '9px', fontWeight: '800'}}>⚠️ 重篤なアレルギーがあります</div>
            <div className="screen-body">
              <div style={{display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '9px'}}>
                <div style={{width: '20px', height: '20px', borderRadius: '6px', border: '1px solid #E0EAE2', background: '#fff', flexShrink: '0'}}></div>
                <div className="app-h1" style={{fontSize: '12px', flex: '1'}}>ゆき の健康情報</div>
                <div className="app-muted" style={{fontSize: '8px', border: '1px solid #E0EAE2', borderRadius: '6px', padding: '2px 5px', position: 'relative'}}>あ+
                  <span className="pin" style={{top: '-10px', right: '-10px', width: '16px', height: '16px', fontSize: '9px'}}>1</span>
                </div>
              </div>
              <div className="app-card" style={{display: 'flex', gap: '9px', alignItems: 'center'}}>
                <div style={{width: '34px', height: '34px', borderRadius: '9px', background: '#E6F4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'}}>🛡️</div>
                <div>
                  <div style={{fontWeight: '900', fontSize: '12px'}}>ゆき</div>
                  <div className="app-row" style={{marginTop: '3px', gap: '4px'}}>
                    <span className="app-pill green">5歳</span><span className="app-pill blue">血液型 A</span>
                  </div>
                </div>
              </div>
              <div className="app-card">
                <div className="app-hd" style={{background: '#FCEAEA', color: '#B83030'}}>⚠️ アレルギー情報</div>
                <div style={{fontWeight: '800', fontSize: '10.5px'}}>卵 <span className="app-pill red" style={{marginLeft: '4px'}}>重篤</span></div>
                <div className="app-muted" style={{marginTop: '2px'}}>経口摂取後30分以内に救急要請</div>
              </div>
              <div className="app-card">
                <div className="app-hd" style={{background: '#E6F4EC', color: '#1A6640'}}>📞 緊急連絡先</div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div><div style={{fontWeight: '800', fontSize: '10.5px'}}>母</div><div className="app-muted">関係：母</div></div>
                  <div className="app-pill green">📞 090-xxxx</div>
                </div>
              </div>
              <div style={{background: '#FCEAEA', border: '1px solid #E8AAAA', borderRadius: '12px', padding: '10px', textAlign: 'center', position: 'relative'}}>
                <div style={{fontWeight: '800', fontSize: '9.5px', color: '#B83030', marginBottom: '6px'}}>この子が危険な状況ですか？</div>
                <div className="app-btn alert" style={{fontSize: '9.5px'}}>🚨 緊急通知を保護者に送る</div>
                <span className="pin" style={{top: '-10px', right: '-10px', width: '16px', height: '16px', fontSize: '9px'}}>2</span>
              </div>
              <div className="app-card" style={{position: 'relative'}}>
                <div className="app-label" style={{marginBottom: '5px'}}>👨‍👩‍👧 保護者の方へ</div>
                <div className="app-muted" style={{fontSize: '9px', marginBottom: '6px'}}>ログインすると登録内容の確認・修正ができます</div>
                <div className="app-btn outline green" style={{fontSize: '9.5px'}}>🔑 保護者ログイン</div>
                <span className="pin" style={{top: '-10px', right: '-10px', width: '16px', height: '16px', fontSize: '9px'}}>3</span>
              </div>
            </div>
          </div>
        </div>
        <p className="device-caption">お子さまの情報ページ（/kid/[slug]）※重篤アレルギー登録時の表示例</p>
      </div>
    </section>

  </div>

  <div className="closing">
    <div className="card">
      <h3>🔒 もっと厳重に見せたい情報がある場合</h3>
      <p>保育園などの施設コードで紐づけると、「🔒 鍵付き」の項目はスタッフ用NFCタグでPIN認証した人だけが見られるようになります。緊急連絡先や持薬など、より配慮したい情報にご活用ください。</p>
    </div>
    <div className="card">
      <h3>💬 うまくいかないときは</h3>
      <p>アプリ内の「よくある質問」もあわせてご確認ください。解決しない場合は <a href="mailto:info@marunostudio.com">info@marunostudio.com</a> までご連絡ください。</p>
    </div>
  </div>

</div>
    </main>
  )
}
