import React from 'react';
import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { getGradeColor } from '../../theme/theme';

interface GradeChipProps extends Omit<ChipProps, 'color'> {
  grade: string;
  size?: 'small' | 'medium';
}

const GradeChip: React.FC<GradeChipProps> = React.memo(({ grade, size = 'medium', ...props }) => {
  const color = getGradeColor(grade);

  return (
    <Chip
      label={grade}
      color={color}
      size={size}
      sx={{
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        minWidth: size === 'small' ? 40 : 48,
        ...props.sx,
      }}
      {...props}
    />
  );
});

export default GradeChip;
