// All site copy and data, in Persian (fa).
// Imagery lives in /media and is served from the app's public directory.

export const brand = {
  name: 'آسمانه',
  latin: 'ASEMANEH',
  tagline: 'بلیط هواپیما، تور و تجربه‌ای متفاوت از سفر',
}

export const navLinks = [
  { label: 'صفحه اصلی', href: '#hero' },
  { label: 'بلیط هواپیما', href: '#search' },
  { label: 'تورها', href: '#packages' },
  { label: 'مقاصد', href: '#destinations' },
  { label: 'خدمات', href: '#services' },
  { label: 'درباره ما', href: '#about' },
]

export const hero = {
  kicker: 'پرواز به یک تجربهٔ تازه',
  title: 'سفر بعدی شما، از اینجا آغاز می‌شود',
  lead: 'بلیط هواپیما، تورهای داخلی و خارجی و تجربه‌ای متفاوت از سفر را با ما تجربه کنید.',
  primaryCta: 'رزرو بلیط',
  secondaryCta: 'کشف مقاصد',
}

export const searchFields = {
  origin: ['تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کیش'],
  destination: ['استانبول', 'دبی', 'پاریس', 'لندن', 'مالدیو', 'توکیو', 'رم', 'وین'],
  passengers: ['۱ مسافر', '۲ مسافر', '۳ مسافر', '۴ مسافر', '۵ مسافر و بیشتر'],
  cabin: ['اقتصادی', 'فرست کلاس', 'بیزینس'],
}

export const destinations = [
  { name: 'استانبول', country: 'ترکیه', price: '۴٬۹۰۰٬۰۰۰', image: '/media/destination-istanbul.jpg' },
  { name: 'دبی', country: 'امارات متحده عربی', price: '۵٬۴۰۰٬۰۰۰', image: '/media/destination-dubai.jpg' },
  { name: 'پاریس', country: 'فرانسه', price: '۱۲٬۸۰۰٬۰۰۰', image: '/media/destination-paris.jpg' },
  { name: 'لندن', country: 'انگلستان', price: '۱۴٬۲۰۰٬۰۰۰', image: '/media/destination-london.jpg' },
  { name: 'مالدیو', country: 'مالدیو', price: '۱۸٬۵۰۰٬۰۰۰', image: '/media/destination-maldives.jpg' },
  { name: 'توکیو', country: 'ژاپن', price: '۲۱٬۹۰۰٬۰۰۰', image: '/media/destination-tokyo.jpg' },
]

export const services = [
  { icon: 'plane', title: 'رزرو بلیط هواپیما', text: 'داخلی و خارجی، با بهترین نرخ‌های روز و امکان انتخاب صندلی.' },
  { icon: 'compass', title: 'تورهای مسافرتی', text: 'تورهای گروهی و اختصاصی، از یک هفته تا یک ماه.' },
  { icon: 'bed', title: 'رزرو هتل', text: 'هتل‌های منتخب از سه تا پنج ستاره در بیش از ۱۲۰ مقصد.' },
  { icon: 'passport', title: 'خدمات ویزا', text: 'مشاوره، تکمیل مدارک و پیگیری پرونده ویزا تا صدور.' },
  { icon: 'shield', title: 'بیمه مسافرتی', text: 'پوشش کامل درمانی و بار، صادرشده در چند دقیقه.' },
  { icon: 'transfer', title: 'ترانسفر فرودگاهی', text: 'خودروی دربست از فرودگاه تا هتل، در هر ساعت از شبانه‌روز.' },
]

export const whyUs = [
  { icon: 'tag', title: 'قیمت‌های رقابتی', text: 'نرخ مستقیم از ایرلاین‌ها، بدون هزینهٔ پنهان.' },
  { icon: 'bolt', title: 'رزرو سریع و آسان', text: 'سه مرحله ساده تا صدور بلیط و دریافت آنی.' },
  { icon: 'headset', title: 'پشتیبانی ۲۴ ساعته', text: 'در تمام ساعات شبانه‌روز، حتی وسط سفر.' },
  { icon: 'lock', title: 'پرداخت امن', text: 'درگاه بانکی معتبر با تضمین بازگشت وجه.' },
  { icon: 'handshake', title: 'همکاری با ایرلاین‌های معتبر', text: 'بیش از ۵۰۰ ایرلاین و اتحادیهٔ پروازی جهان.' },
  { icon: 'aftercare', title: 'خدمات پس از فروش', text: 'تغییر تاریخ، استرداد و پیگیری تا پایان سفر.' },
]

export const experience = {
  eyebrow: 'تجربهٔ سفر',
  title: 'بیشتر از یک بلیط، یک تجربه',
  text: 'ما فقط بلیط نمی‌فروشیم. از انتخاب مقصد و هتل تا ترانسفر، ویزا و برنامهٔ روزهای سفر، همه‌چیز را طوری می‌چینیم که شما فقط در لحظه باشید. مسیر شما را می‌شناسیم و پیش از آنکه سؤالی بپرسید، پاسخش آماده است.',
  cta: 'مشاهده خدمات',
  image: '/media/experience-window.jpg',
  points: ['برنامهٔ اختصاصی برای هر مسافر', 'همراهی یک کارشناس از ابتدا تا بازگشت'],
}

export const airlines = [
  { name: 'امارات', latin: 'Emirates' },
  { name: 'قطر ایرویز', latin: 'Qatar Airways' },
  { name: 'ترکیش ایرلاینز', latin: 'Turkish Airlines' },
  { name: 'لوفت‌هانزا', latin: 'Lufthansa' },
  { name: 'ایرفرانس', latin: 'Air France' },
  { name: 'سنگاپور ایرلاینز', latin: 'Singapore Airlines' },
]

export const packages = [
  {
    title: 'تور رویایی مالدیو',
    duration: '۷ شب و ۸ روز',
    hotel: 'هتل ۵ ستاره، ویلای روی آب',
    rating: '۴٫۹',
    price: '۵۹٬۹۰۰٬۰۰۰',
    image: '/media/package-maldives.jpg',
    cta: 'مشاهده تور',
  },
  {
    title: 'تور استانبول',
    duration: '۴ شب و ۵ روز',
    hotel: 'هتل ۴ ستاره، مرکز شهر',
    rating: '۴٫۷',
    price: '۱۸٬۵۰۰٬۰۰۰',
    image: '/media/package-istanbul.jpg',
    cta: 'مشاهده تور',
  },
  {
    title: 'تور دبی',
    duration: '۵ شب و ۶ روز',
    hotel: 'هتل ۵ ستاره، ساحل جمیرا',
    rating: '۴٫۸',
    price: '۲۹٬۴۰۰٬۰۰۰',
    image: '/media/package-dubai.jpg',
    cta: 'مشاهده تور',
  },
]

export const testimonials = [
  {
    name: 'سارا محمدی',
    destination: 'سفر به استانبول',
    rating: '۵',
    text: 'از انتخاب هتل تا ترانسفر فرودگاه همه‌چیز دقیق و بی‌دغدغه بود. با یک تماس همهٔ سؤال‌هایم جواب گرفت.',
    avatar: '/media/avatar-1.jpg',
  },
  {
    name: 'امیر رضایی',
    destination: 'سفر به مالدیو',
    rating: '۵',
    text: 'همان چیزی که در عکس‌ها دیدم، همان را تجربه کردم. رزرو ویلای روی آب فقط چند دقیقه وقت گرفت.',
    avatar: '/media/avatar-2.jpg',
  },
  {
    name: 'نگین کریمی',
    destination: 'سفر به پاریس',
    rating: '۴٫۵',
    text: 'قیمت‌ها واقعاً منصفانه بود و پشتیبانی نیمه‌شب هم پاسخگو بود. سفری بدون استرس داشتیم.',
    avatar: '/media/avatar-3.jpg',
  },
]

export const stats = [
  { value: 250000, suffix: '+', label: 'مسافر راضی' },
  { value: 120, suffix: '+', label: 'مقصد گردشگری' },
  { value: 500, suffix: '+', label: 'مسیر پروازی' },
  { value: 15, suffix: '+', label: 'سال تجربه' },
]

export const articles = [
  {
    title: 'بهترین زمان سفر به استانبول',
    category: 'راهنمای مقصد',
    readTime: '۶ دقیقه مطالعه',
    image: '/media/article-istanbul.jpg',
  },
  {
    title: 'راهنمای سفر به دبی',
    category: 'راهنمای مقصد',
    readTime: '۸ دقیقه مطالعه',
    image: '/media/article-dubai.jpg',
  },
  {
    title: '۱۰ مقصد رویایی برای سفر',
    category: 'الهام‌بخش',
    readTime: '۵ دقیقه مطالعه',
    image: '/media/article-dream.jpg',
  },
  {
    title: 'نکات مهم قبل از پرواز',
    category: 'نکات سفر',
    readTime: '۴ دقیقه مطالعه',
    image: '/media/article-preflight.jpg',
  },
]

export const newsletter = {
  title: 'مقصد بعدی‌تان را از دست ندهید',
  text: 'با عضویت در خبرنامه، از جدیدترین پیشنهادهای سفر و قیمت‌های ویژه باخبر شوید.',
  placeholder: 'آدرس ایمیل شما',
  cta: 'عضویت',
}

export const faqs = [
  {
    q: 'چگونه بلیط هواپیما رزرو کنم؟',
    a: 'مبدا، مقصد و تاریخ سفر را در فرم جست‌وجو انتخاب کنید. پس از نمایش پروازها، پرواز دلخواه را برگزینید و با تکمیل اطلاعات مسافران، بلیط شما بلافاصله صادر و به ایمیل‌تان ارسال می‌شود.',
  },
  {
    q: 'امکان استرداد بلیط وجود دارد؟',
    a: 'بله. شرایط استرداد بر اساس نوع بلیط و قوانین ایرلاین تعیین می‌شود. پیش از خرید، مبلغ استرداد در صفحهٔ پرداخت به شما نمایش داده می‌شود تا با آگاهی کامل تصمیم بگیرید.',
  },
  {
    q: 'میزان بار مجاز پرواز چقدر است؟',
    a: 'در پروازهای داخلی معمولاً ۲۰ کیلوگرم بار و ۷ کیلوگرم بار همراه و در پروازهای خارجی بسته به ایرلاین تا ۳۰ کیلوگرم مجاز است. جزئیات دقیق بار در کارت هر پرواز درج شده است.',
  },
  {
    q: 'چگونه می‌توانم تور رزرو کنم؟',
    a: 'در بخش تورها، مقصد و مدت سفر را انتخاب کنید و درخواست خود را ثبت کنید. کارشناسان ما در کمتر از یک ساعت کاری با شما تماس می‌گیرند و برنامهٔ سفر را نهایی می‌کنند.',
  },
  {
    q: 'آیا امکان پرداخت آنلاین وجود دارد؟',
    a: 'بله. پرداخت از طریق تمام کارت‌های عضو شتاب و درگاه بانکی امن انجام می‌شود و امکان پرداخت اعتباری تا چهار قسط نیز برای تورها فراهم است.',
  },
  {
    q: 'پشتیبانی در چه ساعاتی فعال است؟',
    a: 'تیم پشتیبانی آسمانه ۲۴ ساعته و در تمام روزهای هفته پاسخگوی شماست؛ از طریق تماس تلفنی، واتس‌اپ و گفت‌وگوی آنلاین.',
  },
]

export const footer = {
  about:
    'آسمانه یک آژانس مسافرتی آنلاین است که رزرو بلیط هواپیما، تور و خدمات کامل سفر را با نگاهی متفاوت به تجربهٔ مسافر ارائه می‌دهد.',
  columns: [
    {
      title: 'دسترسی سریع',
      links: ['درباره ما', 'خدمات', 'مقاصد', 'تورها', 'سوالات متداول'],
    },
    {
      title: 'خدمات مشتریان',
      links: ['تماس با ما', 'قوانین و مقررات', 'شرایط استرداد', 'حریم خصوصی', 'همکاری با ما'],
    },
  ],
  contact: [
    { label: '۰۲۱ ۹۱۰۰ ۲۰۳۰', icon: 'phone' },
    { label: 'hello@asemaneh.example', icon: 'mail' },
    { label: 'تهران، خیابان ولیعصر، پلاک ۲۴', icon: 'pin' },
  ],
  social: ['اینستاگرام', 'تلگرام', 'لینکدین', 'یوتیوب'],
  copyright: 'تمامی حقوق این وب‌سایت محفوظ است.',
}
