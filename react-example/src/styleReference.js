// What the checkout accepts in the `style` query param.
// Mirrors src/views/flexx-apps/checkout/checkoutStyle.tsx in FlexxDashboardApp —
// keep the two in sync when the checkout's style contract changes.

export const MAX_STYLE_LENGTH = 12000;

export const VARIABLES = [
  { name: 'colorPrimary', hint: 'opaque color' },
  { name: 'colorPrimaryText', hint: 'opaque color' },
  { name: 'colorText', hint: 'opaque color' },
  { name: 'colorTextSecondary', hint: 'opaque color' },
  { name: 'colorTextMuted', hint: 'opaque color' },
  { name: 'colorSuccess', hint: 'opaque color' },
  { name: 'colorDanger', hint: 'opaque color' },
  { name: 'colorBackground', hint: 'color, may be translucent' },
  { name: 'colorPageBackground', hint: 'color, may be translucent' },
  { name: 'colorSurface', hint: 'color, may be translucent' },
  { name: 'fontFamily', hint: 'one of the fonts below' },
  { name: 'borderRadius', hint: 'px or rem, 0–999px' },
];

// The checkout's own defaults, shown as placeholders in the visual editor.
export const DEFAULT_VARIABLE_VALUES = {
  colorPrimary: '#000000',
  colorText: '#000000',
  colorTextSecondary: 'rgba(46,38,61,0.7)',
  colorTextMuted: '#A3A3A3',
  colorBackground: '#FFFFFF',
  colorPageBackground: 'transparent',
  colorSurface: '#F4F4F4',
  colorSuccess: '#54A96C',
  colorDanger: '#FF4444',
  borderRadius: '8px',
};

// Visual editor groups. Everything else is still reachable through the JSON editor.
export const THEME_COLORS = [
  { name: 'colorPrimary', label: 'Primary' },
  { name: 'colorPrimaryText', label: 'Text on primary' },
  { name: 'colorText', label: 'Text' },
  { name: 'colorTextSecondary', label: 'Secondary text' },
  { name: 'colorTextMuted', label: 'Muted text' },
  { name: 'colorBackground', label: 'Background' },
  { name: 'colorPageBackground', label: 'Page background' },
  { name: 'colorSurface', label: 'Surface' },
  { name: 'colorSuccess', label: 'Success' },
  { name: 'colorDanger', label: 'Danger' },
];

export const QUICK_RULES = [
  {
    selector: '.PayButton',
    label: 'Pay button',
    fields: ['backgroundColor', 'color', 'borderRadius', 'fontWeight', 'fontSize'],
  },
  { selector: '.PayButton:hover', label: 'Pay button (hover)', fields: ['backgroundColor', 'color'] },
  { selector: '.Heading', label: 'Heading', fields: ['color', 'fontWeight', 'fontSize'] },
  { selector: '.Amount', label: 'Amount', fields: ['color', 'fontWeight', 'fontSize'] },
  { selector: '.Label', label: 'Field labels', fields: ['color', 'fontWeight', 'fontSize'] },
  { selector: '.Tab--selected', label: 'Selected tab', fields: ['color', 'backgroundColor'] },
  { selector: '.Card', label: 'Cards', fields: ['backgroundColor', 'borderRadius'] },
];

export const FONT_WEIGHTS = ['400', '500', '600', '700'];

export const COMPONENTS = [
  'Card', 'SummaryCard', 'PaymentCard', 'Divider', 'IconTile', 'Heading',
  'Subheading', 'Label', 'Value', 'ValueSecondary', 'Amount', 'Link', 'TabList',
  'Tab', 'PlanCard', 'PlanTitle', 'PlanAmount', 'PlanAmountSuffix', 'PlanCaption',
  'PlanRadio', 'Accordion', 'AccordionTitle', 'FeeRow', 'FeeLabel', 'FeeAmount',
  'TotalLabel', 'TotalAmount', 'PayButton', 'Checkbox', 'CheckboxLabel',
  'ErrorText', 'Disclaimer', 'SecureNote', 'PoweredBy', 'SuccessIcon',
  'SuccessTitle', 'SuccessMessage',
];

export const MODIFIERS = {
  Tab: ['selected'],
  PlanCard: ['selected'],
  IconTile: ['selected'],
  PlanRadio: ['selected'],
  PayButton: ['disabled'],
  Value: ['highlight'],
};

export const PSEUDOS = ['hover', 'focus-visible'];

export const PROPERTIES = [
  { name: 'color', hint: 'opaque color' },
  { name: 'backgroundColor', hint: 'color, may be translucent' },
  { name: 'fontFamily', hint: 'one of the fonts below' },
  { name: 'fontWeight', hint: '400 | 500 | 600 | 700' },
  { name: 'fontSize', hint: '10–48px (px or rem)' },
  { name: 'borderRadius', hint: 'PayButton and card components only' },
];

export const FONT_FAMILIES = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Nunito',
  'Source Sans 3', 'Work Sans', 'DM Sans',
];

export const RULE_NOTES = [
  'Card, SummaryCard and PaymentCard accept only backgroundColor and borderRadius.',
  'borderRadius in rules works only on PayButton, PlanCard and the card components.',
  'Colors: hex, rgb(a), hsl(a) or transparent.',
];

export const PRESETS = {
  None: null,
  Starter: {
    variables: {
      colorPrimary: '#2563EB',
      colorText: '#0F172A',
      fontFamily: 'Inter',
      borderRadius: '10px',
    },
    rules: {
      '.PayButton': { fontWeight: '600' },
      '.PayButton:hover': { backgroundColor: '#1D4ED8' },
      '.Tab--selected': { color: '#2563EB' },
    },
    showPoweredBy: true,
  },
  Dark: {
    variables: {
      colorPrimary: '#A78BFA',
      colorPrimaryText: '#111827',
      colorText: '#F9FAFB',
      colorTextSecondary: '#D1D5DB',
      colorTextMuted: '#9CA3AF',
      colorBackground: '#111827',
      colorPageBackground: '#030712',
      colorSurface: '#1F2937',
      fontFamily: 'DM Sans',
    },
    rules: {},
    showPoweredBy: true,
  },
  'Rounded, no branding': {
    variables: { borderRadius: '20px', fontFamily: 'Poppins' },
    rules: {
      '.PayButton': { borderRadius: '999px', fontSize: '16px' },
      '.Heading': { fontWeight: '700' },
    },
    showPoweredBy: false,
  },
};
