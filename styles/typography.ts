export const Typography = {
  fontFamily: {
    thin: 'Poppins-Thin',
    extraLight: 'Poppins-ExtraLight',
    light: 'Poppins-Light',
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
    extraBold: 'Poppins-ExtraBold',
    black: 'Poppins-Black',
    thinItalic: 'Poppins-ThinItalic',
    extraLightItalic: 'Poppins-ExtraLightItalic',
    lightItalic: 'Poppins-LightItalic',
    italic: 'Poppins-Italic',
    mediumItalic: 'Poppins-MediumItalic',
    semiBoldItalic: 'Poppins-SemiBoldItalic',
    boldItalic: 'Poppins-BoldItalic',
    extraBoldItalic: 'Poppins-ExtraBoldItalic',
    blackItalic: 'Poppins-BlackItalic',
  },
  
  fontSize: {
    xs: 14,
    sm: 16,
    base: 18,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 32,
    '4xl': 36,
    '5xl': 42,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
} as const;

export const TextStyles = {
  h1: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize['4xl'],
    lineHeight: Typography.lineHeight.tight,
  },
  h2: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize['3xl'],
    lineHeight: Typography.lineHeight.tight,
  },
  h3: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize['2xl'],
    lineHeight: Typography.lineHeight.normal,
  },
  h4: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.xl,
    lineHeight: Typography.lineHeight.normal,
  },
  
  // Body text
  bodyLarge: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.lg,
    lineHeight: Typography.lineHeight.normal,
  },
  body: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.lineHeight.normal,
  },
  bodySmall: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.normal,
  },
  
  label: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.normal,
  },
  labelSmall: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.normal,
  },
  
  button: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.lineHeight.tight,
  },
  buttonSmall: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.tight,
  },
} as const;

export const getFontFamily = (weight: keyof typeof Typography.fontFamily = 'regular', italic = false) => {
  if (italic) {
    switch (weight) {
      case 'thin': return Typography.fontFamily.thinItalic;
      case 'extraLight': return Typography.fontFamily.extraLightItalic;
      case 'light': return Typography.fontFamily.lightItalic;
      case 'regular': return Typography.fontFamily.italic;
      case 'medium': return Typography.fontFamily.mediumItalic;
      case 'semiBold': return Typography.fontFamily.semiBoldItalic;
      case 'bold': return Typography.fontFamily.boldItalic;
      case 'extraBold': return Typography.fontFamily.extraBoldItalic;
      case 'black': return Typography.fontFamily.blackItalic;
      default: return Typography.fontFamily.italic;
    }
  }
  return Typography.fontFamily[weight];
};