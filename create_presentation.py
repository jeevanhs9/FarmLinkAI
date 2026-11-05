"""
Generate SAP Hackfest 2026 Presentation for FarmLink AI
5-slide presentation covering Domain, Technology, and Business perspectives
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor

def create_farmlink_presentation():
    # Create presentation
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)
    
    # Define color palette (Forest green theme from FarmLink)
    FOREST_GREEN = RGBColor(37, 110, 65)  # #256e41
    LEAF_GREEN = RGBColor(132, 182, 141)  # #84b68d
    CLAY_ORANGE = RGBColor(201, 106, 58)  # #c96a3a
    INK_DARK = RGBColor(26, 32, 28)  # #1a201c
    SAND_BG = RGBColor(248, 246, 243)  # #f8f6f3
    WHITE = RGBColor(255, 255, 255)
    
    # ==================== SLIDE 1: TITLE SLIDE ====================
    slide1 = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout
    
    # Background
    background = slide1.shapes.add_shape(1, 0, 0, prs.slide_width, prs.slide_height)
    background.fill.solid()
    background.fill.fore_color.rgb = FOREST_GREEN
    background.line.fill.background()
    
    # Top badge
    badge = slide1.shapes.add_textbox(Inches(0.5), Inches(1), Inches(9), Inches(0.5))
    badge_frame = badge.text_frame
    badge_frame.text = "SAP HACKFEST 2026 BENGALURU · DOMAIN + TECHNOLOGY + BUSINESS"
    badge_p = badge_frame.paragraphs[0]
    badge_p.alignment = PP_ALIGN.CENTER
    badge_p.font.size = Pt(11)
    badge_p.font.bold = True
    badge_p.font.color.rgb = LEAF_GREEN
    
    # Main title
    title_box = slide1.shapes.add_textbox(Inches(1), Inches(2), Inches(8), Inches(2))
    title_frame = title_box.text_frame
    title_frame.text = "FarmLink AI"
    title_p = title_frame.paragraphs[0]
    title_p.alignment = PP_ALIGN.CENTER
    title_p.font.size = Pt(72)
    title_p.font.bold = True
    title_p.font.color.rgb = WHITE
    
    # Subtitle
    subtitle_box = slide1.shapes.add_textbox(Inches(1), Inches(4), Inches(8), Inches(1))
    subtitle_frame = subtitle_box.text_frame
    subtitle_frame.text = "Direct markets. Smarter decisions. Better delivery."
    subtitle_p = subtitle_frame.paragraphs[0]
    subtitle_p.alignment = PP_ALIGN.CENTER
    subtitle_p.font.size = Pt(28)
    subtitle_p.font.color.rgb = LEAF_GREEN
    subtitle_p.font.italic = True
    
    # Description
    desc_box = slide1.shapes.add_textbox(Inches(2), Inches(5.5), Inches(6), Inches(1))
    desc_frame = desc_box.text_frame
    desc_frame.text = "AI-Powered Supply Chain Resilience for Smallholder Farmers & FPOs"
    desc_p = desc_frame.paragraphs[0]
    desc_p.alignment = PP_ALIGN.CENTER
    desc_p.font.size = Pt(18)
    desc_p.font.color.rgb = WHITE
    
    # Footer
    footer_box = slide1.shapes.add_textbox(Inches(1), Inches(6.8), Inches(8), Inches(0.5))
    footer_frame = footer_box.text_frame
    footer_frame.text = "Integrating SAP S/4HANA MM · SAP TM · SAP Control Tower"
    footer_p = footer_frame.paragraphs[0]
    footer_p.alignment = PP_ALIGN.CENTER
    footer_p.font.size = Pt(12)
    footer_p.font.color.rgb = LEAF_GREEN
    
    # ==================== SLIDE 2: PROBLEM STATEMENT (DOMAIN) ====================
    slide2 = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Background
    bg2 = slide2.shapes.add_shape(1, 0, 0, prs.slide_width, prs.slide_height)
    bg2.fill.solid()
    bg2.fill.fore_color.rgb = SAND_BG
    bg2.line.fill.background()
    
    # Header bar
    header2 = slide2.shapes.add_shape(1, 0, 0, prs.slide_width, Inches(1))
    header2.fill.solid()
    header2.fill.fore_color.rgb = FOREST_GREEN
    header2.line.fill.background()
    
    # Badge
    badge2 = slide2.shapes.add_textbox(Inches(0.5), Inches(0.15), Inches(3), Inches(0.35))
    badge2_frame = badge2.text_frame
    badge2_frame.text = "DOMAIN PERSPECTIVE"
    badge2_p = badge2_frame.paragraphs[0]
    badge2_p.font.size = Pt(10)
    badge2_p.font.bold = True
    badge2_p.font.color.rgb = LEAF_GREEN
    
    # Title
    title2 = slide2.shapes.add_textbox(Inches(0.5), Inches(0.5), Inches(9), Inches(0.4))
    title2_frame = title2.text_frame
    title2_frame.text = "Problem Statement: The Last-Mile Crisis in Agricultural Supply Chains"
    title2_p = title2_frame.paragraphs[0]
    title2_p.font.size = Pt(26)
    title2_p.font.bold = True
    title2_p.font.color.rgb = WHITE
    
    # Content area
    content_top = Inches(1.3)
    
    # Problem box 1
    prob1 = slide2.shapes.add_shape(1, Inches(0.5), content_top, Inches(4.3), Inches(2))
    prob1.fill.solid()
    prob1.fill.fore_color.rgb = WHITE
    prob1.line.color.rgb = CLAY_ORANGE
    prob1.line.width = Pt(2)
    
    prob1_text = slide2.shapes.add_textbox(Inches(0.7), content_top + Inches(0.2), Inches(3.9), Inches(1.6))
    prob1_frame = prob1_text.text_frame
    prob1_frame.word_wrap = True
    
    p1_title = prob1_frame.paragraphs[0]
    p1_title.text = "🚜 Fragmented Supply"
    p1_title.font.size = Pt(16)
    p1_title.font.bold = True
    p1_title.font.color.rgb = CLAY_ORANGE
    
    prob1_frame.add_paragraph()
    p1_content = prob1_frame.paragraphs[1]
    p1_content.text = "• Small farmers lack volume to fill vehicles\n• Under-utilized trucks = 40-60% capacity\n• Multiple intermediaries reduce margins by 30-40%\n• 15-20% post-harvest losses due to delays"
    p1_content.font.size = Pt(11)
    p1_content.font.color.rgb = INK_DARK
    p1_content.line_spacing = Pt(16)
    
    # Problem box 2
    prob2 = slide2.shapes.add_shape(1, Inches(5.2), content_top, Inches(4.3), Inches(2))
    prob2.fill.solid()
    prob2.fill.fore_color.rgb = WHITE
    prob2.line.color.rgb = CLAY_ORANGE
    prob2.line.width = Pt(2)
    
    prob2_text = slide2.shapes.add_textbox(Inches(5.4), content_top + Inches(0.2), Inches(3.9), Inches(1.6))
    prob2_frame = prob2_text.text_frame
    prob2_frame.word_wrap = True
    
    p2_title = prob2_frame.paragraphs[0]
    p2_title.text = "🏪 Buyer Inefficiency"
    p2_title.font.size = Pt(16)
    p2_title.font.bold = True
    p2_title.font.color.rgb = CLAY_ORANGE
    
    prob2_frame.add_paragraph()
    p2_content = prob2_frame.paragraphs[1]
    p2_content.text = "• Struggle to find consistent quality & volume\n• Coordinate multiple suppliers manually\n• Uncertain delivery timelines\n• Limited visibility into supply availability"
    p2_content.font.size = Pt(11)
    p2_content.font.color.rgb = INK_DARK
    p2_content.line_spacing = Pt(16)
    
    # Problem box 3
    prob3 = slide2.shapes.add_shape(1, Inches(0.5), Inches(3.5), Inches(4.3), Inches(2))
    prob3.fill.solid()
    prob3.fill.fore_color.rgb = WHITE
    prob3.line.color.rgb = CLAY_ORANGE
    prob3.line.width = Pt(2)
    
    prob3_text = slide2.shapes.add_textbox(Inches(0.7), Inches(3.7), Inches(3.9), Inches(1.6))
    prob3_frame = prob3_text.text_frame
    prob3_frame.word_wrap = True
    
    p3_title = prob3_frame.paragraphs[0]
    p3_title.text = "🚛 Logistics Chaos"
    p3_title.font.size = Pt(16)
    p3_title.font.bold = True
    p3_title.font.color.rgb = CLAY_ORANGE
    
    prob3_frame.add_paragraph()
    p3_content = prob3_frame.paragraphs[1]
    p3_content.text = "• Separate under-filled trips increase costs\n• Poor route optimization (31% excess distance)\n• No real-time shipment visibility\n• High fuel costs & carbon emissions"
    p3_content.font.size = Pt(11)
    p3_content.font.color.rgb = INK_DARK
    p3_content.line_spacing = Pt(16)
    
    # Problem box 4
    prob4 = slide2.shapes.add_shape(1, Inches(5.2), Inches(3.5), Inches(4.3), Inches(2))
    prob4.fill.solid()
    prob4.fill.fore_color.rgb = WHITE
    prob4.line.color.rgb = CLAY_ORANGE
    prob4.line.width = Pt(2)
    
    prob4_text = slide2.shapes.add_textbox(Inches(5.4), Inches(3.7), Inches(3.9), Inches(1.6))
    prob4_frame = prob4_text.text_frame
    prob4_frame.word_wrap = True
    
    p4_title = prob4_frame.paragraphs[0]
    p4_title.text = "⚠️ Disruption Vulnerability"
    p4_title.font.size = Pt(16)
    p4_title.font.bold = True
    p4_title.font.color.rgb = CLAY_ORANGE
    
    prob4_frame.add_paragraph()
    p4_content = prob4_frame.paragraphs[1]
    p4_content.text = "• Buyer cancellations strand perishable goods\n• No alternative matching mechanism\n• Weather disruptions cascade losses\n• Zero recovery protocols"
    p4_content.font.size = Pt(11)
    p4_content.font.color.rgb = INK_DARK
    p4_content.line_spacing = Pt(16)
    
    # Bottom impact statement
    impact_box = slide2.shapes.add_shape(1, Inches(1), Inches(5.8), Inches(8), Inches(1.3))
    impact_box.fill.solid()
    impact_box.fill.fore_color.rgb = FOREST_GREEN
    impact_box.line.fill.background()
    
    impact_text = slide2.shapes.add_textbox(Inches(1.2), Inches(6), Inches(7.6), Inches(0.9))
    impact_frame = impact_text.text_frame
    impact_frame.word_wrap = True
    
    impact_p = impact_frame.paragraphs[0]
    impact_p.text = "💡 Core Challenge: Smallholder farmers receive 30-40% less than market price while perishable goods face 15-20% wastage due to fragmented, inefficient supply chains lacking transparency, coordination, and resilience."
    impact_p.font.size = Pt(13)
    impact_p.font.bold = True
    impact_p.font.color.rgb = WHITE
    impact_p.alignment = PP_ALIGN.CENTER
    
    # ==================== SLIDE 3: OBJECTIVES ====================
    slide3 = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Background
    bg3 = slide3.shapes.add_shape(1, 0, 0, prs.slide_width, prs.slide_height)
    bg3.fill.solid()
    bg3.fill.fore_color.rgb = SAND_BG
    bg3.line.fill.background()
    
    # Header bar
    header3 = slide3.shapes.add_shape(1, 0, 0, prs.slide_width, Inches(1))
    header3.fill.solid()
    header3.fill.fore_color.rgb = FOREST_GREEN
    header3.line.fill.background()
    
    # Badge
    badge3 = slide3.shapes.add_textbox(Inches(0.5), Inches(0.15), Inches(3), Inches(0.35))
    badge3_frame = badge3.text_frame
    badge3_frame.text = "OBJECTIVES & GOALS"
    badge3_p = badge3_frame.paragraphs[0]
    badge3_p.font.size = Pt(10)
    badge3_p.font.bold = True
    badge3_p.font.color.rgb = LEAF_GREEN
    
    # Title
    title3 = slide3.shapes.add_textbox(Inches(0.5), Inches(0.5), Inches(9), Inches(0.4))
    title3_frame = title3.text_frame
    title3_frame.text = "Transforming Agricultural Supply Chains Through AI & Integration"
    title3_p = title3_frame.paragraphs[0]
    title3_p.font.size = Pt(26)
    title3_p.font.bold = True
    title3_p.font.color.rgb = WHITE
    
    # Objectives
    obj_top = Inches(1.5)
    
    # Objective 1
    obj1 = slide3.shapes.add_shape(1, Inches(0.5), obj_top, Inches(9), Inches(0.95))
    obj1.fill.solid()
    obj1.fill.fore_color.rgb = WHITE
    obj1.line.color.rgb = FOREST_GREEN
    obj1.line.width = Pt(2)
    
    obj1_text = slide3.shapes.add_textbox(Inches(0.7), obj_top + Inches(0.15), Inches(8.6), Inches(0.65))
    obj1_frame = obj1_text.text_frame
    obj1_frame.word_wrap = True
    
    obj1_title = obj1_frame.paragraphs[0]
    obj1_title.text = "1. Maximize Farmer Net Realization (+35-45% income improvement)"
    obj1_title.font.size = Pt(15)
    obj1_title.font.bold = True
    obj1_title.font.color.rgb = FOREST_GREEN
    
    obj1_frame.add_paragraph()
    obj1_content = obj1_frame.paragraphs[1]
    obj1_content.text = "Direct buyer matching eliminates intermediaries • AI-powered demand forecasting & price intelligence • Transparent offer comparison maximizes proceeds"
    obj1_content.font.size = Pt(11)
    obj1_content.font.color.rgb = INK_DARK
    
    # Objective 2
    obj2 = slide3.shapes.add_shape(1, Inches(0.5), obj_top + Inches(1.15), Inches(9), Inches(0.95))
    obj2.fill.solid()
    obj2.fill.fore_color.rgb = WHITE
    obj2.line.color.rgb = FOREST_GREEN
    obj2.line.width = Pt(2)
    
    obj2_text = slide3.shapes.add_textbox(Inches(0.7), obj_top + Inches(1.3), Inches(8.6), Inches(0.65))
    obj2_frame = obj2_text.text_frame
    obj2_frame.word_wrap = True
    
    obj2_title = obj2_frame.paragraphs[0]
    obj2_title.text = "2. Reduce Logistics Costs & Environmental Impact (-28-31% transport costs)"
    obj2_title.font.size = Pt(15)
    obj2_title.font.bold = True
    obj2_title.font.color.rgb = FOREST_GREEN
    
    obj2_frame.add_paragraph()
    obj2_content = obj2_frame.paragraphs[1]
    obj2_content.text = "Intelligent load pooling consolidates shipments • Optimized multi-stop routing • 70-85% vehicle utilization • Lower CO₂ emissions per kg transported"
    obj2_content.font.size = Pt(11)
    obj2_content.font.color.rgb = INK_DARK
    
    # Objective 3
    obj3 = slide3.shapes.add_shape(1, Inches(0.5), obj_top + Inches(2.3), Inches(9), Inches(0.95))
    obj3.fill.solid()
    obj3.fill.fore_color.rgb = WHITE
    obj3.line.color.rgb = FOREST_GREEN
    obj3.line.width = Pt(2)
    
    obj3_text = slide3.shapes.add_textbox(Inches(0.7), obj_top + Inches(2.45), Inches(8.6), Inches(0.65))
    obj3_frame = obj3_text.text_frame
    obj3_frame.word_wrap = True
    
    obj3_title = obj3_frame.paragraphs[0]
    obj3_title.text = "3. Build Supply Chain Resilience & Recovery Mechanisms"
    obj3_title.font.size = Pt(15)
    obj3_title.font.bold = True
    obj3_title.font.color.rgb = FOREST_GREEN
    
    obj3_frame.add_paragraph()
    obj3_content = obj3_frame.paragraphs[1]
    obj3_content.text = "Automated disruption detection & alternative buyer matching (93% match score) • Real-time supply-demand gap analysis • Perishability-aware rerouting within transit windows"
    obj3_content.font.size = Pt(11)
    obj3_content.font.color.rgb = INK_DARK
    
    # Objective 4
    obj4 = slide3.shapes.add_shape(1, Inches(0.5), obj_top + Inches(3.45), Inches(9), Inches(0.95))
    obj4.fill.solid()
    obj4.fill.fore_color.rgb = WHITE
    obj4.line.color.rgb = FOREST_GREEN
    obj4.line.width = Pt(2)
    
    obj4_text = slide3.shapes.add_textbox(Inches(0.7), obj_top + Inches(3.6), Inches(8.6), Inches(0.65))
    obj4_frame = obj4_text.text_frame
    obj4_frame.word_wrap = True
    
    obj4_title = obj4_frame.paragraphs[0]
    obj4_title.text = "4. Enable Enterprise Integration & Compliance (SAP S/4HANA, SAP TM, Control Tower)"
    obj4_title.font.size = Pt(15)
    obj4_title.font.bold = True
    obj4_title.font.color.rgb = FOREST_GREEN
    
    obj4_frame.add_paragraph()
    obj4_content = obj4_frame.paragraphs[1]
    obj4_content.text = "OData v4 & RFC BAPI adapters for procurement (MM) • Freight order sync with SAP TM • Disruption alerts to SAP Control Tower • Full audit trail & compliance"
    obj4_content.font.size = Pt(11)
    obj4_content.font.color.rgb = INK_DARK
    
    # Success metrics footer
    metrics_box = slide3.shapes.add_shape(1, Inches(1), Inches(5.9), Inches(8), Inches(1.2))
    metrics_box.fill.solid()
    metrics_box.fill.fore_color.rgb = LEAF_GREEN
    metrics_box.line.fill.background()
    
    metrics_text = slide3.shapes.add_textbox(Inches(1.2), Inches(6.05), Inches(7.6), Inches(0.9))
    metrics_frame = metrics_text.text_frame
    metrics_frame.word_wrap = True
    
    metrics_p = metrics_frame.paragraphs[0]
    metrics_p.text = "✓ Success Metrics: Farmer income +40% • Logistics cost -30% • Food waste -50% • 85%+ vehicle utilization • Sub-24hr alternative buyer matching • Full SAP integration via OData/RFC"
    metrics_p.font.size = Pt(12)
    metrics_p.font.bold = True
    metrics_p.font.color.rgb = INK_DARK
    metrics_p.alignment = PP_ALIGN.CENTER
    
    # ==================== SLIDE 4: SOLUTION (TECHNOLOGY) ====================
    slide4 = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Background
    bg4 = slide4.shapes.add_shape(1, 0, 0, prs.slide_width, prs.slide_height)
    bg4.fill.solid()
    bg4.fill.fore_color.rgb = SAND_BG
    bg4.line.fill.background()
    
    # Header bar
    header4 = slide4.shapes.add_shape(1, 0, 0, prs.slide_width, Inches(1))
    header4.fill.solid()
    header4.fill.fore_color.rgb = FOREST_GREEN
    header4.line.fill.background()
    
    # Badge
    badge4 = slide4.shapes.add_textbox(Inches(0.5), Inches(0.15), Inches(3), Inches(0.35))
    badge4_frame = badge4.text_frame
    badge4_frame.text = "TECHNOLOGY ARCHITECTURE"
    badge4_p = badge4_frame.paragraphs[0]
    badge4_p.font.size = Pt(10)
    badge4_p.font.bold = True
    badge4_p.font.color.rgb = LEAF_GREEN
    
    # Title
    title4 = slide4.shapes.add_textbox(Inches(0.5), Inches(0.5), Inches(9), Inches(0.4))
    title4_frame = title4.text_frame
    title4_frame.text = "Proposed Solution: FarmLink AI Platform Architecture"
    title4_p = title4_frame.paragraphs[0]
    title4_p.font.size = Pt(26)
    title4_p.font.bold = True
    title4_p.font.color.rgb = WHITE
    
    # Architecture layers
    layer_top = Inches(1.3)
    layer_height = Inches(1.15)
    layer_gap = Inches(0.15)
    
    # Layer 1: Frontend
    layer1 = slide4.shapes.add_shape(1, Inches(0.5), layer_top, Inches(9), layer_height)
    layer1.fill.solid()
    layer1.fill.fore_color.rgb = WHITE
    layer1.line.color.rgb = FOREST_GREEN
    layer1.line.width = Pt(2)
    
    l1_text = slide4.shapes.add_textbox(Inches(0.7), layer_top + Inches(0.1), Inches(8.6), layer_height - Inches(0.2))
    l1_frame = l1_text.text_frame
    l1_frame.word_wrap = True
    
    l1_title = l1_frame.paragraphs[0]
    l1_title.text = "🖥️ FRONTEND LAYER • Multi-Stakeholder Experience"
    l1_title.font.size = Pt(13)
    l1_title.font.bold = True
    l1_title.font.color.rgb = FOREST_GREEN
    
    l1_frame.add_paragraph()
    l1_content = l1_frame.paragraphs[1]
    l1_content.text = "React 19 + Vite PWA (responsive web) • Flutter mobile app (offline-first for farmers) • Role-based dashboards: Farmer, Buyer, Logistics, Admin\nReal-time charts (Recharts) • Interactive maps (Google Maps API) • Accessible UI (WCAG 2.1 AA) • Regional language support (Kannada+)"
    l1_content.font.size = Pt(10)
    l1_content.font.color.rgb = INK_DARK
    l1_content.line_spacing = Pt(14)
    
    # Layer 2: Backend & AI
    layer2 = slide4.shapes.add_shape(1, Inches(0.5), layer_top + layer_height + layer_gap, Inches(9), layer_height)
    layer2.fill.solid()
    layer2.fill.fore_color.rgb = WHITE
    layer2.line.color.rgb = FOREST_GREEN
    layer2.line.width = Pt(2)
    
    l2_text = slide4.shapes.add_textbox(Inches(0.7), layer_top + layer_height + layer_gap + Inches(0.1), Inches(8.6), layer_height - Inches(0.2))
    l2_frame = l2_text.text_frame
    l2_frame.word_wrap = True
    
    l2_title = l2_frame.paragraphs[0]
    l2_title.text = "🤖 INTELLIGENT ENGINES • AI & Optimization Algorithms"
    l2_title.font.size = Pt(13)
    l2_title.font.bold = True
    l2_title.font.color.rgb = FOREST_GREEN
    
    l2_frame.add_paragraph()
    l2_content = l2_frame.paragraphs[1]
    l2_content.text = "Flask REST API (Python) • PostgreSQL + SQLAlchemy ORM • JWT authentication & RBAC\nForecasting Engine: Time-series (MAPE 2.8%) • Matching Engine: Multi-criteria scoring (93% accuracy) • Pooling Engine: Vehicle routing problem (VRP) solver • Pricing Engine: Dynamic offer evaluation with freight/fee calculation"
    l2_content.font.size = Pt(10)
    l2_content.font.color.rgb = INK_DARK
    l2_content.line_spacing = Pt(14)
    
    # Layer 3: SAP Integration
    layer3 = slide4.shapes.add_shape(1, Inches(0.5), layer_top + 2*(layer_height + layer_gap), Inches(9), layer_height)
    layer3.fill.solid()
    layer3.fill.fore_color.rgb = WHITE
    layer3.line.color.rgb = FOREST_GREEN
    layer3.line.width = Pt(2)
    
    l3_text = slide4.shapes.add_textbox(Inches(0.7), layer_top + 2*(layer_height + layer_gap) + Inches(0.1), Inches(8.6), layer_height - Inches(0.2))
    l3_frame = l3_text.text_frame
    l3_frame.word_wrap = True
    
    l3_title = l3_frame.paragraphs[0]
    l3_title.text = "🔗 SAP ENTERPRISE GATEWAY • Seamless ERP & SCM Integration"
    l3_title.font.size = Pt(13)
    l3_title.font.bold = True
    l3_title.font.color.rgb = FOREST_GREEN
    
    l3_frame.add_paragraph()
    l3_content = l3_frame.paragraphs[1]
    l3_content.text = "SAP S/4HANA MM: Purchase Order creation via API_PURCHASEORDER_PROCESS_SRV (OData v4)\nSAP Transportation Management (TM): Freight Order sync via FreightOrder_In (RFC BAPI)\nSAP Control Tower: Disruption event publishing via EventManagement_In • cXML & REST webhook support"
    l3_content.font.size = Pt(10)
    l3_content.font.color.rgb = INK_DARK
    l3_content.line_spacing = Pt(14)
    
    # Layer 4: Data Sources
    layer4 = slide4.shapes.add_shape(1, Inches(0.5), layer_top + 3*(layer_height + layer_gap), Inches(9), layer_height)
    layer4.fill.solid()
    layer4.fill.fore_color.rgb = WHITE
    layer4.line.color.rgb = FOREST_GREEN
    layer4.line.width = Pt(2)
    
    l4_text = slide4.shapes.add_textbox(Inches(0.7), layer_top + 3*(layer_height + layer_gap) + Inches(0.1), Inches(8.6), layer_height - Inches(0.2))
    l4_frame = l4_text.text_frame
    l4_frame.word_wrap = True
    
    l4_title = l4_frame.paragraphs[0]
    l4_title.text = "📊 EXTERNAL DATA INTEGRATIONS • Real-Time Market Intelligence"
    l4_title.font.size = Pt(13)
    l4_title.font.bold = True
    l4_title.font.color.rgb = FOREST_GREEN
    
    l4_frame.add_paragraph()
    l4_content = l4_frame.paragraphs[1]
    l4_content.text = "Agmarknet & data.gov.in: Live mandi prices & arrivals • OpenWeather API: Weather forecasts & alerts\nGoogle Maps Platform: Geocoding, routing, distance matrix • Govt FPO directories • Quality certification APIs"
    l4_content.font.size = Pt(10)
    l4_content.font.color.rgb = INK_DARK
    l4_content.line_spacing = Pt(14)
    
    # ==================== SLIDE 5: BUSINESS VALUE & IMPACT ====================
    slide5 = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Background
    bg5 = slide5.shapes.add_shape(1, 0, 0, prs.slide_width, prs.slide_height)
    bg5.fill.solid()
    bg5.fill.fore_color.rgb = SAND_BG
    bg5.line.fill.background()
    
    # Header bar
    header5 = slide5.shapes.add_shape(1, 0, 0, prs.slide_width, Inches(1))
    header5.fill.solid()
    header5.fill.fore_color.rgb = FOREST_GREEN
    header5.line.fill.background()
    
    # Badge
    badge5 = slide5.shapes.add_textbox(Inches(0.5), Inches(0.15), Inches(3), Inches(0.35))
    badge5_frame = badge5.text_frame
    badge5_frame.text = "BUSINESS PERSPECTIVE"
    badge5_p = badge5_frame.paragraphs[0]
    badge5_p.font.size = Pt(10)
    badge5_p.font.bold = True
    badge5_p.font.color.rgb = LEAF_GREEN
    
    # Title
    title5 = slide5.shapes.add_textbox(Inches(0.5), Inches(0.5), Inches(9), Inches(0.4))
    title5_frame = title5.text_frame
    title5_frame.text = "Business Value Proposition & Market Impact"
    title5_p = title5_frame.paragraphs[0]
    title5_p.font.size = Pt(26)
    title5_p.font.bold = True
    title5_p.font.color.rgb = WHITE
    
    # Value propositions - 3 columns
    col_width = Inches(2.9)
    col_gap = Inches(0.3)
    val_top = Inches(1.3)
    
    # Column 1: Farmer Value
    col1 = slide5.shapes.add_shape(1, Inches(0.5), val_top, col_width, Inches(2.2))
    col1.fill.solid()
    col1.fill.fore_color.rgb = LEAF_GREEN
    col1.line.fill.background()
    
    col1_text = slide5.shapes.add_textbox(Inches(0.65), val_top + Inches(0.15), col_width - Inches(0.3), Inches(1.9))
    col1_frame = col1_text.text_frame
    col1_frame.word_wrap = True
    
    col1_title = col1_frame.paragraphs[0]
    col1_title.text = "👨‍🌾 FARMER VALUE"
    col1_title.font.size = Pt(14)
    col1_title.font.bold = True
    col1_title.font.color.rgb = WHITE
    col1_title.alignment = PP_ALIGN.CENTER
    
    col1_frame.add_paragraph()
    col1_content = col1_frame.paragraphs[1]
    col1_content.text = "• +35-45% income vs intermediaries\n• Direct market access\n• Transparent pricing\n• Reduced spoilage\n• AI-driven harvest timing\n• Payment within 24-48 hrs\n• FPO-assisted onboarding"
    col1_content.font.size = Pt(10)
    col1_content.font.color.rgb = WHITE
    col1_content.line_spacing = Pt(15)
    
    # Column 2: Buyer Value
    col2 = slide5.shapes.add_shape(1, Inches(0.5) + col_width + col_gap, val_top, col_width, Inches(2.2))
    col2.fill.solid()
    col2.fill.fore_color.rgb = FOREST_GREEN
    col2.line.fill.background()
    
    col2_text = slide5.shapes.add_textbox(Inches(0.5) + col_width + col_gap + Inches(0.15), val_top + Inches(0.15), col_width - Inches(0.3), Inches(1.9))
    col2_frame = col2_text.text_frame
    col2_frame.word_wrap = True
    
    col2_title = col2_frame.paragraphs[0]
    col2_title.text = "🏪 BUYER VALUE"
    col2_title.font.size = Pt(14)
    col2_title.font.bold = True
    col2_title.font.color.rgb = WHITE
    col2_title.alignment = PP_ALIGN.CENTER
    
    col2_frame.add_paragraph()
    col2_content = col2_frame.paragraphs[1]
    col2_content.text = "• Consistent quality & volume\n• Verified supplier network\n• Predictable delivery\n• Lower procurement cost\n• Single-platform sourcing\n• Supply reliability score\n• Quality traceability"
    col2_content.font.size = Pt(10)
    col2_content.font.color.rgb = WHITE
    col2_content.line_spacing = Pt(15)
    
    # Column 3: System Value
    col3 = slide5.shapes.add_shape(1, Inches(0.5) + 2*(col_width + col_gap), val_top, col_width, Inches(2.2))
    col3.fill.solid()
    col3.fill.fore_color.rgb = CLAY_ORANGE
    col3.line.fill.background()
    
    col3_text = slide5.shapes.add_textbox(Inches(0.5) + 2*(col_width + col_gap) + Inches(0.15), val_top + Inches(0.15), col_width - Inches(0.3), Inches(1.9))
    col3_frame = col3_text.text_frame
    col3_frame.word_wrap = True
    
    col3_title = col3_frame.paragraphs[0]
    col3_title.text = "🌍 SYSTEM VALUE"
    col3_title.font.size = Pt(14)
    col3_title.font.bold = True
    col3_title.font.color.rgb = WHITE
    col3_title.alignment = PP_ALIGN.CENTER
    
    col3_frame.add_paragraph()
    col3_content = col3_frame.paragraphs[1]
    col3_content.text = "• -28% logistics costs\n• -31% transport distance\n• -50% food waste\n• Lower CO₂ emissions\n• Supply chain resilience\n• Data-driven policy insights\n• UN SDG alignment"
    col3_content.font.size = Pt(10)
    col3_content.font.color.rgb = WHITE
    col3_content.line_spacing = Pt(15)
    
    # Go-to-Market Strategy
    gtm_box = slide5.shapes.add_shape(1, Inches(0.5), Inches(3.8), Inches(9), Inches(1.4))
    gtm_box.fill.solid()
    gtm_box.fill.fore_color.rgb = WHITE
    gtm_box.line.color.rgb = FOREST_GREEN
    gtm_box.line.width = Pt(2)
    
    gtm_text = slide5.shapes.add_textbox(Inches(0.7), Inches(3.95), Inches(8.6), Inches(1.1))
    gtm_frame = gtm_text.text_frame
    gtm_frame.word_wrap = True
    
    gtm_title = gtm_frame.paragraphs[0]
    gtm_title.text = "📍 GO-TO-MARKET STRATEGY • Phased District Rollout"
    gtm_title.font.size = Pt(14)
    gtm_title.font.bold = True
    gtm_title.font.color.rgb = FOREST_GREEN
    
    gtm_frame.add_paragraph()
    gtm_content = gtm_frame.paragraphs[1]
    gtm_content.text = "Phase 1 (Pilot): Bengaluru-Kolar corridor with 5 FPOs, 15 buyers, 3 logistics partners • 6-month validation\nPhase 2 (Scale): Expand to 3 Karnataka districts • SAP enterprise customer integration • B2B SaaS revenue model\nPhase 3 (National): Pan-India via NABARD FPO network • Govt partnership (e-NAM integration) • Carbon credit monetization"
    gtm_content.font.size = Pt(10)
    gtm_content.font.color.rgb = INK_DARK
    gtm_content.line_spacing = Pt(14)
    
    # Financial Impact
    fin_box = slide5.shapes.add_shape(1, Inches(1), Inches(5.5), Inches(8), Inches(1.6))
    fin_box.fill.solid()
    fin_box.fill.fore_color.rgb = FOREST_GREEN
    fin_box.line.fill.background()
    
    fin_text = slide5.shapes.add_textbox(Inches(1.2), Inches(5.65), Inches(7.6), Inches(1.3))
    fin_frame = fin_text.text_frame
    fin_frame.word_wrap = True
    
    fin_title = fin_frame.paragraphs[0]
    fin_title.text = "💰 FINANCIAL & SOCIAL IMPACT PROJECTIONS"
    fin_title.font.size = Pt(14)
    fin_title.font.bold = True
    fin_title.font.color.rgb = LEAF_GREEN
    fin_title.alignment = PP_ALIGN.CENTER
    
    fin_frame.add_paragraph()
    fin_content = fin_frame.paragraphs[1]
    fin_content.text = "Year 1: 10,000 farmers • ₹50 Cr GMV • 15,000 MT produce • ₹7.5 Cr farmer income gain\nYear 3: 100,000 farmers • ₹500 Cr GMV • 25% market share in 5 states • 2.5 Lakh MT waste reduction\nUN SDG Alignment: #2 Zero Hunger • #8 Decent Work • #12 Responsible Consumption • #13 Climate Action"
    fin_content.font.size = Pt(11)
    fin_content.font.color.rgb = WHITE
    fin_content.line_spacing = Pt(16)
    fin_content.alignment = PP_ALIGN.CENTER
    
    # Save presentation
    prs.save('Sap.pptx')
    print("✅ Presentation 'Sap.pptx' created successfully!")
    print("📊 5 slides covering Domain, Technology, and Business perspectives")
    print("🎨 Professional design with FarmLink brand colors")

if __name__ == "__main__":
    try:
        create_farmlink_presentation()
    except ImportError:
        print("❌ Error: python-pptx library not found")
        print("📦 Install it with: pip install python-pptx")
    except Exception as e:
        print(f"❌ Error creating presentation: {e}")
