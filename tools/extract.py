#!/usr/bin/env python3
"""
Builds the product catalogue data (src/data/catalog.json) and crops every
product photo / brand logo / customer logo out of the 2026 B2B catalogue PDF.

Usage:
  pdftoppm -r 250 -png "Palaniappa_Electronics_-_B2B_Catalog_2026.pdf" /tmp/pages/p
  python3 tools/extract.py /tmp/pages

All crop boxes below are in "catalogue page units": an A4 page rendered
827px wide (100 dpi). They are scaled to the 250 dpi render automatically.
Re-run only when the catalogue changes; the outputs are committed.
"""
import json, os, re, sys
from PIL import Image, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = sys.argv[1] if len(sys.argv) > 1 else "/tmp/pages"
IMG_OUT = os.path.join(ROOT, "src", "assets", "img")
DATA_OUT = os.path.join(ROOT, "src", "data", "catalog.json")
SCALE = 2066 / 827.0

_page_cache = {}


def page(n):
    if n not in _page_cache:
        _page_cache[n] = Image.open(os.path.join(PAGES, "p-%02d.png" % n)).convert("RGB")
    return _page_cache[n]


def slug(s):
    import unicodedata
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower().replace("&", "and")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def trim(im, thresh=48, pad=10):
    bg = Image.new("RGB", im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > thresh else 0)
    box = diff.getbbox()
    if not box:
        return im
    x1, y1, x2, y2 = box
    x1, y1 = max(0, x1 - pad), max(0, y1 - pad)
    x2, y2 = min(im.width, x2 + pad), min(im.height, y2 + pad)
    return im.crop((x1, y1, x2, y2))


def crop(p, box, out_rel, do_trim=False, inset=2, max_w=1400, quality=80, square_pad=False):
    x1, y1, x2, y2 = box
    b = tuple(int(round(v * SCALE)) for v in (x1 + inset, y1 + inset, x2 - inset, y2 - inset))
    im = page(p).crop(b)
    if do_trim:
        im = trim(im)
    if square_pad:
        # centre a white-background product on a padded white canvas (4:3)
        w, h = im.size
        cw = max(w, int(h * 4 / 3)) + 40
        ch = max(h, int(cw * 3 / 4)) + 40
        canvas = Image.new("RGB", (cw, ch), (255, 255, 255))
        canvas.paste(im, ((cw - w) // 2, (ch - h) // 2))
        im = canvas
    if im.width > max_w:
        im = im.resize((max_w, int(im.height * max_w / im.width)), Image.LANCZOS)
    path = os.path.join(IMG_OUT, out_rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "WEBP", quality=quality, method=6)
    return "/assets/img/" + out_rel, im.size


def grid(cols, rows):
    """cols: list of (x1,x2); rows: list of (y1,y2) -> boxes row-major"""
    return [(c[0], r[0], c[1], r[1]) for r in rows for c in cols]


# --------------------------------------------------------------------------
# Brand logos (cropped from the catalogue) -> /assets/img/brands/<slug>.webp
# --------------------------------------------------------------------------
BRANDS = {
    "Samsung": (3, (46, 237, 140, 281)),
    "Vzy by Dish TV": (3, (150, 237, 254, 281)),
    "Hepi": (3, (631, 755, 769, 797)),
    "LYNK Cloud": (3, (631, 806, 769, 848)),
    "Dish TV d2h": (3, (82, 1058, 218, 1100)),
    "Sony": (4, (642, 276, 757, 301)),
    "Yara Electronics": (4, (78, 855, 207, 884)),
    "Zeetaminds": (4, (603, 1053, 765, 1100)),
    "ASPA LED": (5, (63, 1029, 277, 1085)),
    "Teachmint": (6, (130, 254, 210, 282)),
    "Raptor": (6, (46, 289, 126, 317)),
    "Lenovo": (6, (130, 775, 210, 803)),
    "Acer": (6, (46, 809, 126, 837)),
    "LG": (6, (701, 1035, 781, 1063)),
    "King Koil": (10, (150, 88, 365, 148)),
    "Ingram Micro": (9, (636, 1100, 784, 1137)),
    "IFB": (16, (737, 113, 787, 133)),
    "Western": (18, (597, 83, 653, 104)),
    "Hoshizaki": (18, (661, 83, 717, 104)),
    "Haier": (18, (727, 83, 792, 104)),
    "Godrej": (18, (727, 920, 787, 941)),
    "Mitsubishi Electric": (19, (246, 94, 322, 122)),
    "Voltas": (19, (423, 94, 492, 122)),
}

# --------------------------------------------------------------------------
# Customers (page 20)
# --------------------------------------------------------------------------
CUSTOMERS = {
    "Hotels": [
        ("Radisson", (30, 100, 200, 180)), ("Hyatt Regency", (215, 100, 315, 180)),
        ("Ideal Beach Resort", (335, 100, 485, 180)), ("Sterling Holidays", (505, 100, 610, 180)),
        ("Fortune Hotels", (630, 100, 800, 180)),
        ("Le Meridien", (30, 185, 205, 255)), ("Taj Hotels", (213, 185, 300, 255)),
        ("Sheraton", (335, 185, 490, 255)), ("Holiday Inn", (505, 185, 615, 255)),
        ("InterContinental", (630, 185, 800, 255)),
        ("Park Hyatt", (40, 265, 220, 335)), ("Aloft Hotels", (240, 265, 400, 335)),
        ("Ramada", (425, 260, 590, 335)), ("Tamil Nadu Tourism Development Corporation", (595, 265, 800, 335)),
        ("GRT Hotels & Resorts", (40, 340, 220, 415)), ("The Raintree Hotels", (270, 340, 370, 415)),
        ("Marriott Hotels & Resorts", (420, 340, 595, 415)), ("Crowne Plaza", (600, 340, 790, 415)),
    ],
    "Hospitals": [
        ("GEM Hospital", (70, 462, 165, 535)), ("MGM Healthcare", (215, 462, 310, 535)),
        ("VS Hospitals", (330, 462, 495, 535)), ("Kauvery Hospital", (505, 462, 618, 535)),
        ("Asian Institute of Nephrology & Urology", (630, 462, 795, 535)),
        ("Vadamalayan Hospitals", (30, 545, 235, 610)), ("Naruvi Hospitals", (240, 545, 400, 610)),
        ("Meenakshi Mission Hospital", (405, 545, 607, 610)), ("Parvathy Hospital", (612, 545, 778, 610)),
        ("A4 Hospital", (50, 615, 215, 695)), ("Medway Hospitals", (255, 615, 385, 695)),
        ("Rainbow Children's Hospital", (460, 615, 585, 695)), ("Healthcare institution", (650, 615, 745, 695)),
    ],
    "Education": [
        ("AISC", (50, 742, 215, 818)), ("Campus K", (285, 742, 360, 818)),
        ("VIT", (460, 742, 555, 818)), ("Kola Saraswathi Vaishnav Senior Secondary School", (598, 742, 798, 818)),
        ("Saveetha University", (50, 818, 215, 900)), ("Sri Venkateshwaraa Medical College", (240, 818, 405, 900)),
        ("Educational institution", (462, 818, 552, 900)), ("Sri Ramachandra Institute", (595, 818, 798, 900)),
        ("SRM Institute of Science & Technology", (80, 900, 245, 978)), ("Medical college", (370, 900, 460, 978)),
        ("Rotary", (578, 900, 748, 978)),
    ],
}

# --------------------------------------------------------------------------
# Catalogue
# --------------------------------------------------------------------------
C5 = [(34, 180), (188, 334), (342, 488), (495, 641), (649, 795)]  # 5-col amenity grid


def items(names, boxes, p, trim_white=False, descs=None):
    out = []
    for i, (n, b) in enumerate(zip(names, boxes)):
        it = {"name": n, "_p": p, "_b": b, "_t": trim_white}
        if descs:
            it["desc"] = descs[i]
        out.append(it)
    assert len(names) == len(boxes), (names, len(boxes))
    return out


CATS = []

# ---- 1. Hospitality TV ----------------------------------------------------
CATS.append({
    "slug": "hospitality-tv", "group": "Displays & AV", "page": 3,
    "name": "Hospitality TV Solutions",
    "short": "Hospitality TVs, boot-up branding, IPTV management software and hotel set-top boxes.",
    "seo": "Hospitality TV solutions in Chennai — Samsung hotel TVs, boot-up logo & video, Hepi and LYNK Cloud TV management software and Dish TV hotel set-top boxes for hotels and hospitals.",
    "intro": "Everything a guest or patient room needs to turn a TV into a branded service screen — from the panel itself to the software and the channel feed behind it.",
    "applications": ["Hotels", "Hospitals"],
    "hero": [3, (279, 95, 796, 292)],
    "sections": [
        {"title": "Hospitality TV", "applications": ["Hotels", "Hospitals"], "brands": ["Samsung", "Vzy by Dish TV"],
         "desc": "Commercial-grade hospitality TVs built for guest rooms and patient rooms, with hotel mode, lock-down settings and central management.",
         "items": items(["Hotel Guest Room TV", "Hospital Patient Room TV"], [(279, 95, 796, 292), (279, 327, 796, 578)], 3)},
        {"title": "Boot-up Logo & Boot-up Video Solution", "brands": ["Samsung"],
         "desc": "When the TV is switched on, the hotel logo and video play first. Only after that can the guest watch channels.",
         "items": items(["Boot-up Logo & Video"], [(70, 472, 230, 570)], 3)},
        {"title": "Hospitality TV Management Software", "brands": ["Hepi", "LYNK Cloud"],
         "desc": "Turn every in-room TV into a guest-service portal with the hotel's branding.",
         "features": [
             ["Personalised welcome", "Guests are greeted by name, in the hotel's own voice."],
             ["Native-language content", "TV channels in the languages guests prefer."],
             ["Premium OTT", "Streaming apps without a TV hardware upgrade."],
             ["Visual food ordering", "Video menus with real-time ordering from the room."],
             ["One-touch services", "Housekeeping and concierge requests from the TV."],
             ["Local discovery", "Curated nearby experiences chosen by the hotel."],
         ],
         "items": items(["Hepi Guest Interface"], [(33, 612, 290, 768)], 3,
                        descs=["Hepi and hotel branding, personalised welcome message, live TV, food and dining, hotel services, amenities and nearby attractions."])},
        {"title": "Set-top Box Solution", "brands": ["Dish TV d2h"],
         "desc": "Hotel-specific set-top boxes and channel packs, installed and maintained for you.",
         "points": [
             "One remote for both TV and set-top box",
             "Special set-top boxes for hotels (HTL boxes)",
             "Free MDU backbone installation",
             "Play and pause on all accounts at no extra charge",
             "Pause room services by occupancy, saving cost every month",
             "Heavy refresh (back-end refresh)",
             "On-demand channel addition and removal",
             "BST FTA pack at Rs.118 and Tamilza Sports pack at Rs.230 for hotels",
             "Customised packs for hotels",
             "Free installation setup (vertical wiring work)",
         ],
         "items": []},
    ],
})

# ---- 2. Signage -----------------------------------------------------------
CATS.append({
    "slug": "digital-signage-kiosks", "group": "Displays & AV", "page": 4,
    "name": "Signage Display & Kiosk Solutions",
    "short": "Digital signage displays, A/T/K-type and self-ordering kiosks with content management software.",
    "seo": "Digital signage displays and kiosks in Chennai — Samsung, Sony and Vzy signage, A-type, T-type, K-type and self-ordering kiosks, plus Zeetaminds content management software.",
    "intro": "Menu boards, lobby screens, wayfinding and self-ordering — commercial displays that run all day, with software to schedule what plays where.",
    "applications": ["Retail", "Restaurants", "Office Lobby", "Manufacturing", "Hotels", "Hospitals", "Factory"],
    "hero": [4, (267, 93, 460, 348)],
    "sections": [
        {"title": "Signage Display", "applications": ["Retail", "Restaurants", "Office Lobby", "Manufacturing"],
         "brands": ["Samsung", "Sony", "Vzy by Dish TV"],
         "desc": "Bright, 24/7-rated commercial displays for menus, promotions, dashboards and corporate communication.",
         "items": items(["Theatre & Café Menu Boards", "Retail Showroom Signage", "Manufacturing Dashboards", "Restaurant Signage", "Office Lobby Display"],
                        [(51, 93, 259, 563), (267, 93, 460, 348), (469, 93, 615, 348), (267, 357, 460, 563), (469, 357, 776, 563)], 4)},
        {"title": "Kiosk Solutions", "applications": ["Retail", "Office", "Hotel", "Hospital", "Factory"],
         "brands": ["Samsung", "Sony", "Yara Electronics"],
         "items": items(["A-Type Kiosk", "T-Type Kiosk", "K-Type Kiosk", "Self-Ordering Kiosk"],
                        [(244, 597, 354, 825), (363, 597, 474, 825), (483, 597, 655, 825), (664, 597, 775, 825)], 4,
                        descs=["Showroom and boutique entrances.", "Floor-standing: hotel lobbies and airports.",
                               "Mall wayfinding and store directories.", "Food store and QSR: order, pay, print bill."])},
        {"title": "Content Management Software", "brands": ["Zeetaminds"],
         "features": [
             ["Content management", "Manage and distribute content across any number of displays with a user-friendly interface."],
             ["Scheduling", "Plan what plays on each display and when."],
             ["Layouts", "Split the screen into zones to play different content in each section at the same time."],
             ["Content design", "Create visuals with direct Canva integration or customisable apps."],
         ],
         "items": items(["Multi-zone Layout with Ticker"], [(61, 933, 293, 1077)], 4)},
    ],
})

# ---- 3. LED walls -----------------------------------------------------------
CATS.append({
    "slug": "led-wall-solutions", "group": "Displays & AV", "page": 5,
    "name": "LED Wall Solutions",
    "short": "Home cinema LED, indoor LED walls and outdoor LED billboards.",
    "seo": "LED wall solutions in Chennai — Samsung and ASPA LED home cinema LED, indoor LED video walls for boardrooms and control rooms, and outdoor LED walls and billboards.",
    "intro": "Seamless, bezel-free LED for every scale — from a private home theatre to a boardroom, a control room or a storefront facing the street.",
    "applications": ["Premium Villas", "Corporate Offices", "Factories", "Hospitals", "Hotels", "Auditoriums", "Retail Stores", "Schools & Colleges"],
    "hero": [5, (297, 93, 776, 407)],
    "sections": [
        {"title": "Home Cinema LED", "applications": ["Premium Villas", "Premium Apartments (Home Theatre)"], "brands": ["Samsung", "ASPA LED"],
         "items": items(["Home Theatre LED"], [(297, 93, 776, 407)], 5)},
        {"title": "Indoor LED Wall", "applications": ["Corporate Offices", "Factories", "Hospitals", "Hotels", "Auditoriums", "Large Venues"],
         "brands": ["Samsung", "ASPA LED"],
         "items": items(["Corporate Boardroom LED Wall", "Control Room / War Room LED Wall"], [(51, 439, 286, 752), (295, 439, 530, 752)], 5)},
        {"title": "Outdoor LED Wall", "applications": ["Retail Stores", "Hotels", "Hospitals", "Factories", "Schools", "Colleges", "Outdoor Billboards"],
         "brands": ["ASPA LED"],
         "items": items(["Retail Store Facade LED", "Outdoor LED Billboard"], [(297, 785, 532, 1098), (541, 785, 776, 1098)], 5)},
    ],
})

# ---- 4. Interactive ----------------------------------------------------------
CATS.append({
    "slug": "interactive-displays", "group": "Displays & AV", "page": 6,
    "name": "Interactive Display Solutions",
    "short": "Interactive touch panels, hybrid VC displays, enterprise mobility and monitors.",
    "seo": "Interactive flat panels and smart boards for schools, colleges and boardrooms in Chennai — Samsung, Teachmint and Raptor interactive displays, hybrid video-conferencing displays, enterprise mobiles, tablets, laptops and monitors.",
    "intro": "Smart classrooms, hybrid meeting rooms and the devices your teams carry — supplied in volume for institutions and enterprises.",
    "applications": ["Schools", "Colleges", "Office Spaces", "Meeting Rooms", "Boardrooms", "Hotels", "Hospitals", "Factory"],
    "hero": [6, (231, 93, 509, 328)],
    "sections": [
        {"title": "Interactive Touch Display", "applications": ["Schools", "Colleges", "Office Spaces", "Meeting Rooms & Boardrooms"],
         "brands": ["Samsung", "Teachmint", "Raptor"],
         "items": items(["Classroom Interactive Panel", "Meeting Room Interactive Panel"], [(231, 93, 509, 328), (517, 93, 794, 328)], 6)},
        {"title": "Hybrid Display", "applications": ["Meeting Rooms & Boardrooms"], "brands": ["Samsung", "Teachmint", "Raptor"],
         "items": items(["Video Conferencing Display", "Boardroom Hybrid Display"], [(33, 353, 311, 589), (319, 353, 596, 589)], 6)},
        {"title": "Enterprise Mobility Solutions", "applications": ["Hotels", "Hospitals", "Education", "Factory & Office"],
         "brands": ["Samsung", "Lenovo", "Acer"],
         "items": items(["Mobile", "Tab", "Rugged Mobile", "Rugged Tab", "Laptop"],
                        [(231, 613, 338, 849), (345, 613, 452, 849), (459, 613, 566, 849), (573, 613, 680, 849), (687, 613, 794, 849)], 6)},
        {"title": "Monitor Display Solutions", "applications": ["Hotels", "Hospitals & Office"], "brands": ["Sony", "LG", "Samsung", "Acer"],
         "items": items(["Medical Monitor", "Business Monitor", "Gaming Monitor"],
                        [(33, 873, 215, 1108), (223, 873, 405, 1108), (413, 873, 595, 1108)], 6)},
    ],
})

# ---- 5. Unique displays ----------------------------------------------------
CATS.append({
    "slug": "unique-display-solutions", "group": "Displays & AV", "page": 7,
    "name": "Unique Display Solutions",
    "short": "Frame TV, Flip, projection mapping, transparent and mirror displays, video walls, Micro RGB and Mini LED.",
    "seo": "Unique display solutions — Samsung Frame TV, Flip, building projection mapping, projection TV, transparent display, mirror display, video wall, Micro RGB TV and Mini LED TV in Chennai.",
    "intro": "Displays that become part of the architecture — art on a wall, a mirror in a suite, a jewel case that tells a story.",
    "applications": ["Hotels", "Retail", "Villas", "Corporate", "Security"],
    "hero": [7, (546, 93, 794, 412)],
    "sections": [
        {"title": "Unique Displays", "items": items(
            ["Frame TV", "Flip TV", "Building Mapping Projection", "Projection TV", "Transparent Display", "Mirror Display", "Video Wall", "Micro RGB TV", "Mini LED TV"],
            grid([(33, 281), (290, 538), (546, 794)], [(93, 412), (438, 757), (783, 1102)]), 7)},
    ],
})

# ---- 6. Unique LED ------------------------------------------------------------
CATS.append({
    "slug": "unique-led-displays", "group": "Displays & AV", "page": 8,
    "name": "Unique LED Wall Displays",
    "short": "Curtain, transparent, flexible and floor LED, LED mobile vans and smart shelf displays.",
    "seo": "Creative LED displays by ASPA LED — curtain LED media facades, transparent LED for shopfronts, flexible LED, interactive floor LED, LED mobile van and smart shelf displays.",
    "intro": "“Brilliance in every pixel” — creative LED formats from ASPA LED for facades, stages, showrooms and the shop floor.",
    "applications": ["Malls", "Showrooms", "Hotels", "Events", "Retail", "Advertising"],
    "hero": [8, (27, 130, 401, 365)],
    "sections": [
        {"title": "Creative LED", "brands": ["ASPA LED"], "items": items(
            ["Curtain LED (Media Facade)", "Transparent LED", "Flexible LED", "Floor LED", "LED Mobile Van", "Smart Shelf Display"],
            grid([(27, 401), (427, 801)], [(130, 365), (471, 705), (810, 1044)]), 8,
            descs=["Lightweight mesh LED for building facades and stages, without adding heavy structural load.",
                   "See-through displays for glass shopfronts that show content without blocking the view.",
                   "Bendable LED panels for curved walls, columns and custom shapes.",
                   "Durable walk-on LED flooring for stages, showrooms and interactive events.",
                   "A digital billboard on wheels that takes your advertisement directly to your audience.",
                   "Compact digital screens on retail shelves that promote offers at the point of purchase."])},
    ],
})

# ---- 7. IT infra ----------------------------------------------------------------
CATS.append({
    "slug": "it-infrastructure", "group": "IT Infrastructure", "page": 9,
    "name": "IT Infrastructure Solutions",
    "short": "Networking, EPABX, security, CCTV, AV and servers — planned, commissioned and handed over.",
    "seo": "IT infrastructure solutions in Chennai — structured cabling, LAN/WAN, Wi-Fi, IP PBX and EPABX, firewalls, CCTV and access control, AV and video conferencing, servers, laptops and desktops. Exclusive hospitality & healthcare partner of Ingram Micro.",
    "intro": "Exclusive Hospitality & Healthcare Partner of Ingram Micro (TechVantage Solutions), covering 500+ brands available in India — with end-to-end execution: planning, commissioning and handover.",
    "applications": ["Corporate Offices", "Hotels", "Hospitals", "Educational Institutions", "Retail", "Factory", "Office Space"],
    "hero": [9, (290, 270, 540, 355)],
    "sections": [
        {"title": "Our Capabilities", "brands": ["Ingram Micro"], "items": items(
            ["Active & Passive Networking", "EPABX & Unified Communications", "Switches, Routers & Network Security",
             "CCTV & Security Systems", "Audio Visual (AV) Solutions", "Systems, Servers & Hardware"],
            grid([(25, 270), (292, 538), (559, 805)], [(282, 356), (546, 622)]), 9, trim_white=True,
            descs=["Structured cabling, LAN/WAN, Wi-Fi & optical fibre — Cat6/Cat6A cabling, fibre optic cabling, patch panels & faceplates, racks & enclosures, network switches, access points, network design & installation.",
                   "IP PBX, intercom, video & voice collaboration — IP PBX systems, SIP trunks & VoIP, call center solutions, video conferencing, unified communication platforms.",
                   "Enterprise switching, routing, firewall & VPN — Layer 2 / Layer 3 switches, enterprise routers, firewall & UTM solutions, load balancers, network monitoring.",
                   "IP cameras, NVR/DVR, access control & attendance — IP & analog cameras, NVR / DVR systems, access control, video analytics, remote monitoring.",
                   "Displays, projectors, video conferencing & PA systems — video conferencing systems, digital signage, LED displays & video walls, audio systems, meeting room solutions.",
                   "Desktops, laptops, servers, storage & printers — servers & storage, desktops / laptops, workstations, UPS & power solutions, end user devices."])},
    ],
})

# ---- 8. Mattress ------------------------------------------------------------
CATS.append({
    "slug": "hospitality-mattress", "group": "Hospitality", "page": 10,
    "name": "Hospitality Mattress Range",
    "short": "King Koil premium hospitality mattresses, bed bases and rollaway beds.",
    "seo": "King Koil hospitality mattresses for hotels in Chennai — Maharaja Suite, Roman Luxury, Pillow Soft, Euro Soft Pro, Euro Express, Rest Azure, bed bases and rollaway beds.",
    "intro": "Premium hospitality bedding from King Koil Mattress Co. — the mattresses, bed bases and rollaways behind a good night's sleep.",
    "applications": ["Hotels", "Resorts", "Serviced Apartments", "Hospitals"],
    "hero": [10, (290, 195, 538, 362)],
    "sections": [
        {"title": "Mattresses", "brands": ["King Koil"], "items": items(
            ["Maharaja Suite", "Roman Luxury", "Pillow Soft", "Euro Soft Pro", "Euro Express", "Rest Azure"],
            grid([(33, 281), (290, 538), (546, 794)], [(195, 362), (395, 562)]), 10)},
        {"title": "Bed Bases", "brands": ["King Koil"], "items": items(
            ["Bed Base - Fabric", "Bed Base - Leatherite", "Bed Base - Floating"],
            grid([(33, 281), (290, 538), (546, 794)], [(640, 826)]), 10)},
        {"title": "Rollaway Beds", "brands": ["King Koil"], "items": items(
            ["Rollaway Bed - Hydraulic", "Rollaway Bed - Non Hydraulic"],
            [(33, 905, 409, 1092), (418, 905, 794, 1092)], 10)},
    ],
})

# ---- 9. Linen ------------------------------------------------------------------
L4 = [(289, 409), (417, 537), (545, 665), (673, 794)]
CATS.append({
    "slug": "hospitality-linen", "group": "Hospitality", "page": 11,
    "name": "Hospitality Linen Range",
    "short": "Bed linen, bath linen, curtains and fittings for hotels and hospitals.",
    "seo": "Hotel linen supplier in Chennai — bed linen, duvets, pillows, bath towels, bath robes, shower curtains, blackout and sheer curtains, curtain rods and tracks for hotels and hospitals.",
    "intro": "Hotel-grade bed linen, bath linen and curtains — supplied by the room or by the property.",
    "applications": ["Hotels", "Resorts", "Hospitals", "Spas", "Service Apartments"],
    "hero": [11, (417, 93, 537, 224)],
    "sections": [
        {"title": "Bed Linen", "items": items(
            ["Mattress Protector", "Bed Spread", "Duvet / Comforter", "Duvet Cover / Comfort Cover",
             "Pillow Cover", "Soft Pillow", "Hard Pillow", "Decorative Cushion", "Decorative Runner"],
            grid(L4, [(93, 224)]) + grid([(97, 217), (225, 345), (353, 473), (481, 601), (609, 729)], [(256, 388)]), 11)},
        {"title": "Bath Linen", "items": items(
            ["Bath Towel", "Hand Towel", "Face Towel", "Bath Mat", "Swimming Pool Towel", "Spa Towel", "Bath Robe & Slippers", "Shower Curtains"],
            grid(L4, [(440, 571)]) + grid([(161, 281), (289, 409), (417, 537), (545, 665)], [(602, 733)]), 11)},
        {"title": "Curtains", "items": items(
            ["Designer Curtains", "Loop Curtain", "Ring Curtain", "Black Out Curtains", "Sheer Curtains", "SS - Curtain Rods", "Tracks & Curtain Fittings"],
            grid(L4, [(785, 916)]) + grid([(225, 345), (353, 473), (481, 601)], [(949, 1080)]), 11)},
    ],
})

# ---- 10. Hotel & hospital amenities -------------------------------------------
CATS.append({
    "slug": "hotel-hospital-amenities", "group": "Hospitality", "page": 12,
    "name": "Hotel & Hospital Amenities",
    "short": "RFID door locks, minibars, digital lockers and in-room appliances.",
    "seo": "Hotel amenities supplier in Chennai — Hafele and Ozone RFID door locks, energy savers, minibars, in-room safes, kettles, hair dryers, irons, air purifiers, water heaters and BLDC fans for hotels and hospitals.",
    "intro": "Door locks, minibars, safes and every in-room appliance — from leading brands and imported ranges.",
    "applications": ["Hotels", "Hospitals", "Hostels", "Service Apartments"],
    "hero": [12, (34, 130, 180, 242)],
    "sections": [
        {"title": "Door Lock Solution", "brands": ["Hafele", "Ozone"], "items": items(
            ["Hotel RFID Card Locks", "Power Saver (Key Tag)", "Card Reader", "RFID Card", "Hand Held Device",
             "Elevator Access Control System", "Hotel Lock Software", "DND Panel", "Room Number Panel", "Doorbell Panel"],
            grid(C5, [(130, 242), (277, 390)]), 12, trim_white=True)},
        {"title": "Mini Bar", "brands": ["JVD", "Walhter", "Bluestar", "Haier", "Imported"], "items": items(
            ["Hard Door Mini Bar", "Glass Door Mini Bar", "Drawer Type Minibar"], grid(C5[:3], [(477, 590)]), 12, trim_white=True)},
        {"title": "Digi Lockers", "brands": ["JVD", "Walhter", "Imported"], "items": items(
            ["Front Open Safe", "Top Open Safe"], grid(C5[3:], [(477, 590)]), 12, trim_white=True)},
        {"title": "In-Room Appliances", "brands": ["JVD", "Walhter", "Dyson", "Imported", "Racold", "TVS Green", "Haier", "Bluestar"], "items": items(
            ["Air Purifier", "Electric Kettle", "Wall Mounted Hair Dryer", "Steam Iron", "Steamer",
             "Telephone", "Dehumidifier", "Aroma Diffuser", "Coffee Machine", "Docking Station",
             "Torch", "Study Lamp", "Water Heater", "BLDC Fan", "Bottom Loading Water Dispenser"],
            grid(C5, [(676, 788), (822, 935), (969, 1081)]), 12, trim_white=True)},
    ],
})

# ---- 11. In-room amenities --------------------------------------------------
CATS.append({
    "slug": "in-room-amenities", "group": "Hospitality", "page": 13,
    "name": "In-Room Amenities",
    "short": "Bins, hangers, iron boards, tray sets, leatherette accessories and more.",
    "seo": "In-room hotel amenities — recycle bins, dustbins, sofa cum beds, iron boards, wooden and satin hangers, coffee mugs, tray sets, luggage racks, leatherette desk pads, bill folders and service directories.",
    "intro": "The finishing touches of a well-run room, in JVD, Walhter and imported ranges.",
    "applications": ["Hotels", "Resorts", "Service Apartments", "Hospitals"],
    "hero": [13, (342, 520, 488, 688)],
    "sections": [
        {"title": "In-Room Amenities", "brands": ["JVD", "Walhter", "Imported"], "items": items(
            ["Recycle Bin", "Double Layer Dustbin", "Sofa Cum Bed", "Foldable Bed", "Iron Box Holder",
             "Iron Board", "Wooden Hangers", "Coat Hangers", "Satin Hangers", "Ash Tray",
             "Coffee Mugs", "High Ball Glass", "Tray Set", "Weighing Scale", "Luggage Rack",
             "Notepad Holder", "Remote Control Holder", "Shoe Tray", "Desk Pad", "Bill Folder",
             "Service Directory", "Meeting Pad", "Signature Pad"],
            grid(C5, [(122, 292), (320, 490), (520, 688), (726, 886)]) + grid(C5[1:4], [(968, 1083)]), 13, trim_white=True)},
    ],
})

# ---- 12. Bathroom & housekeeping --------------------------------------------
CATS.append({
    "slug": "bathroom-housekeeping-amenities", "group": "Hospitality", "page": 14,
    "name": "Bathroom & Housekeeping Amenities",
    "short": "Bathroom accessories, dispensers, trolleys and housekeeping equipment.",
    "seo": "Bathroom and housekeeping amenities for hotels and hospitals — soap dispensers, towel racks, shaving mirrors, hand dryers, housekeeping trolleys, linen trolleys, wringer trolleys, vacuum and steam cleaners.",
    "intro": "Bathroom fittings and the housekeeping kit that keeps a property spotless.",
    "applications": ["Hotels", "Hospitals", "Offices", "Malls", "Hostels"],
    "hero": [14, (495, 650, 641, 771)],
    "sections": [
        {"title": "Bathroom Amenities", "brands": ["JVD", "Walhter", "Imported"], "items": items(
            ["Shaving Mirror", "Anti Slip Shower Mat", "Wall Mounted Soap Dispensers", "Clothes Line", "Towel Rack",
             "Toilet Roll Holder", "Corner Shelf", "Towel Holder", "Pedal Bin", "Gargle / Whiskey Glass",
             "Bathroom Tray Set", "Soap Dish", "Soap Dispenser", "Tissue Box", "Condiment Holder"],
            grid(C5, [(130, 251), (287, 406), (442, 563)]), 14, trim_white=True)},
        {"title": "Housekeeping Amenities", "brands": ["JVD", "Walhter", "Imported"], "items": items(
            ["Automatic Hand Dryer", "Paper Towel Dispenser", "Caution Board", "Housekeeping Trolley", "Linen Trolley",
             "Service Trolley", "Collection Trolley", "Mop Stick", "Wringer Trolley", "Garbage Trolley",
             "Wet & Dry Vacuum Cleaner", "Steam Cleaner", "Laundry Trolley", "Glass Cleaning Equipment", "Restroom Signage"],
            grid(C5, [(650, 771), (806, 926), (961, 1082)]), 14, trim_white=True)},
    ],
})

# ---- 13. Lobby, banquet & restaurant ----------------------------------------
CATS.append({
    "slug": "lobby-banquet-restaurant-amenities", "group": "Hospitality", "page": 15,
    "name": "Lobby, Banquet & Restaurant Amenities",
    "short": "Luggage trolleys, Q-managers, banquet furniture, crockery, cutlery and glassware.",
    "seo": "Lobby, banquet and restaurant amenities in Chennai — bird cage luggage trolleys, Q-managers, umbrella stands, banquet chairs, chair covers, folding tables, podiums, mobile stages, porcelain crockery, SS cutlery and glassware.",
    "intro": "From the porte-cochère to the banquet hall — front-of-house equipment and F&B service ware.",
    "applications": ["Hotels", "Banquet Halls", "Restaurants", "Marriage Halls", "Corporate Offices"],
    "hero": [15, (291, 122, 411, 277)],
    "sections": [
        {"title": "Lobby Amenities", "items": items(
            ["Q-Manager", "Ash & Trash Bin", "Bird Cage Trolley", "Hand Luggage Cart", "Lobby Display Stand", "Newspaper Stand",
             "Shoe Polish Machine", "Umbrella Stand", "Guest Umbrella", "Hand Truck", "Luggage Trolley", "Swing Bin"],
            grid([(35, 155), (163, 283), (291, 411), (419, 539), (547, 667), (675, 795)], [(122, 277), (306, 462)]), 15, trim_white=True)},
        {"title": "Banquet Amenities", "items": items(
            ["Banquet Chairs", "Chair Cover", "Bow", "Baby Chair", "Rectangular Table", "Round Table", "Podium", "Foldable Mobile Stage"],
            grid([(84, 244), (254, 414), (424, 584), (594, 754)], [(532, 688), (718, 873)]), 15, trim_white=True)},
        {"title": "Restaurant Amenities", "items": items(
            ["Porcelain & Ceramic Crockery", "SS Cutlery", "Glassware"],
            grid([(35, 282), (290, 537), (546, 794)], [(944, 1097)]), 15, trim_white=True)},
    ],
})

# ---- 14. Dishwashing ----------------------------------------------------------
CATS.append({
    "slug": "dishwashing-solutions", "group": "Commercial Kitchen & Laundry", "page": 16,
    "name": "Dish Washing Solutions",
    "short": "IFB rack conveyor, hood type and under-counter glass & dish washers.",
    "seo": "Commercial dishwashers in Chennai — IFB rack conveyor dish washers, hood type dish washers and under-counter glass and dish washers for restaurants, hotels, hospitals, factories and hostels.",
    "intro": "Commercial ware-washing from IFB — sized for a bar counter or a canteen serving thousands.",
    "applications": ["Restaurant", "Hotel", "Hospital", "Factory", "Hostels"],
    "hero": [16, (33, 141, 794, 432)],
    "sections": [
        {"title": "Commercial Dishwashers", "brands": ["IFB"], "items": items(
            ["Rack Conveyor Dish Washer", "Hood Type Dish Washer", "Under Counter Glass Washer", "Under Counter Dish Washer"],
            [(33, 141, 794, 432), (33, 501, 794, 791), (33, 860, 412, 1090), (415, 860, 794, 1090)], 16)},
    ],
})

# ---- 15. Laundry ------------------------------------------------------------------
CATS.append({
    "slug": "laundry-solutions", "group": "Commercial Kitchen & Laundry", "page": 17,
    "name": "Laundry Solutions",
    "short": "Washer extractors, tumble dryers, flatwork ironers, sheet folders and laundromats.",
    "seo": "Commercial laundry equipment in Chennai — IFB washer extractors, tumble dryers, flatwork ironers, automatic sheet folders, vacuum ironing tables and LG laundromat solutions for hotels, hospitals, co-living spaces and hostels.",
    "intro": "On-premise laundry plants from IFB and LG — specified, installed and supported.",
    "applications": ["Hotels", "Hospitals", "Factory", "Co-living Spaces", "High-rise Apartments", "Hostels"],
    "hero": [17, (33, 108, 408, 410)],
    "sections": [
        {"title": "Commercial Laundry", "brands": ["IFB", "LG"], "items": items(
            ["Washer Extractor", "Tumble Dryer", "Flatwork Ironer", "Automatic Sheet Folder", "Vacuum Ironing Table", "Laundromat"],
            [(33, 108, 408, 410), (419, 108, 794, 410), (33, 483, 408, 760), (419, 483, 794, 760), (33, 818, 408, 1095), (419, 818, 794, 1095)], 17)},
    ],
})

# ---- 16. Refrigeration --------------------------------------------------------
CATS.append({
    "slug": "refrigeration-solutions", "group": "Cooling & Refrigeration", "page": 18,
    "name": "Refrigeration Solutions",
    "short": "Commercial, hospitality and healthcare refrigeration — Western, Hoshizaki, Haier, Godrej.",
    "seo": "Commercial refrigeration in Chennai — Western, Hoshizaki, Haier and Godrej visi coolers, chest freezers, wine chillers, ice machines, under-counter chillers, ILR, pharmaceutical refrigerators, vaccine freezers and blood bank refrigerators.",
    "intro": "Cold chain for retail, kitchens and healthcare — from a back-bar cooler to a blood bank refrigerator.",
    "applications": ["Retail", "Restaurants", "Hotels", "Hospitals", "Pharma", "Blood Banks"],
    "hero": [18, (548, 118, 794, 265)],
    "sections": [
        {"title": "Commercial Range", "brands": ["Western", "Hoshizaki", "Haier"], "items": items(
            ["Back Bar Refrigeration", "Wine Chiller", "Visi Cooler", "Visi Freezer", "Hard Top Chest Freezer", "Glass Top Chest Freezer",
             "Confectionery Showcase", "Plug-in Open Chiller", "Water Cooler"],
            grid([(34, 279), (291, 536), (548, 794)], [(118, 265), (302, 449), (487, 633)]), 18, trim_white=True)},
        {"title": "Hospitality Range", "brands": ["Western", "Hoshizaki"], "items": items(
            ["Upright Chiller / Freezer", "Under Counter Chiller / Freezer", "Ice Machines", "Ice Dispenser", "Flexi Drawer Under Counter"],
            grid([(34, 176), (188, 330), (342, 484), (496, 638), (650, 792)], [(730, 857)]), 18, trim_white=True)},
        {"title": "Health Care Range", "brands": ["Western", "Godrej"], "items": items(
            ["ILR (Ice Lined Refrigerator)", "Pharmaceutical Refrigerator", "Vaccine Freezer (-20°C / -40°C / -60°C)", "Blood Bank Refrigerator"],
            grid([(34, 215), (226, 407), (418, 600), (611, 792)], [(953, 1100)]), 18, trim_white=True)},
    ],
})

# ---- 17. Cooling ---------------------------------------------------------------
CATS.append({
    "slug": "commercial-cooling-hvac", "group": "Cooling & Refrigeration", "page": 19,
    "name": "Commercial Cooling & HVAC Solutions",
    "short": "Cassette, tower, ductable and split ACs plus VRV / VRF systems.",
    "seo": "Commercial air conditioning and HVAC in Chennai — Mitsubishi Electric, Samsung, Voltas and Haier 360° cassette, four-way and one-way cassette ACs, tower ACs, ductable ACs, split ACs and VRV / VRF systems for hotels, hospitals, schools and showrooms.",
    "intro": "Air-conditioning designed around the space — supplied for hotels, hospitals, schools, showrooms, villas, restaurants and marriage halls.",
    "applications": ["Hotels", "Hospitals", "Education", "Retail Showrooms", "Villas", "Restaurants", "Marriage Halls"],
    "hero": [19, (33, 143, 408, 338)],
    "sections": [
        {"title": "Commercial Air Conditioning", "brands": ["Mitsubishi Electric", "Samsung", "Voltas", "Haier"], "items": items(
            ["360 Degree Cassette AC", "Four Way Cassette AC", "One Way Cassette AC", "Tower AC", "Ductable AC", "Split AC (High Wall)"],
            [(33, 143, 408, 338), (419, 143, 794, 338), (33, 394, 408, 589), (419, 394, 794, 589), (33, 646, 408, 841), (419, 646, 794, 841)], 19)},
        {"title": "VRV / VRF AC Solutions", "brands": ["Mitsubishi Electric", "Samsung", "Voltas", "Haier"],
         "desc": "Any type of indoor units, one outdoor unit for all.",
         "items": items(["VRV / VRF AC System"], [(55, 898, 770, 1090)], 19)},
    ],
})


def main():
    os.makedirs(IMG_OUT, exist_ok=True)
    data = {"brands": {}, "customers": {}, "categories": []}

    # Site imagery
    crop(1, (175, 70, 662, 225), "site/logo-lockup.webp", max_w=900)
    crop(1, (175, 70, 333, 225), "site/logo-mark.webp", max_w=400)
    crop(2, (88, 868, 361, 1050), "site/warehouse-chromepet.webp", inset=4)
    crop(2, (466, 868, 739, 1050), "site/our-team.webp", inset=4)
    crop(1, (0, 520, 827, 1030), "site/spiral.webp", inset=0)

    for name, (p, b) in BRANDS.items():
        src, size = crop(p, b, "brands/%s.webp" % slug(name), do_trim=True, inset=1, quality=90)
        data["brands"][name] = {"logo": src, "w": size[0], "h": size[1]}

    for group, rows in CUSTOMERS.items():
        out = []
        for name, b in rows:
            src, size = crop(20, b, "customers/%s.webp" % slug(name), do_trim=True, inset=1, quality=88)
            out.append({"name": name, "logo": src, "w": size[0], "h": size[1]})
        data["customers"][group] = out

    for cat in CATS:
        c = {k: v for k, v in cat.items() if k not in ("sections", "hero")}
        hp, hb = cat["hero"]
        c["hero"], _ = crop(hp, hb, "%s/_hero.webp" % cat["slug"], inset=3)
        c["sections"] = []
        for sec in cat["sections"]:
            s = {k: v for k, v in sec.items() if k != "items"}
            s["items"] = []
            for it in sec["items"]:
                isl = slug(it["name"])
                src, size = crop(it["_p"], it["_b"], "%s/%s.webp" % (cat["slug"], isl),
                                 do_trim=it["_t"], inset=3, square_pad=it["_t"])
                o = {"name": it["name"], "slug": isl, "img": src, "w": size[0], "h": size[1]}
                if "desc" in it:
                    o["desc"] = it["desc"]
                s["items"].append(o)
            c["sections"].append(s)
        data["categories"].append(c)

    os.makedirs(os.path.dirname(DATA_OUT), exist_ok=True)
    with open(DATA_OUT, "w") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
    n = sum(len(s["items"]) for c in data["categories"] for s in c["sections"])
    print("categories:", len(data["categories"]), "products:", n)


if __name__ == "__main__":
    main()
