'use client';

import { useEffect, useState } from 'react';
import useAutocomplete, {
  AutocompleteGetItemProps,
  UseAutocompleteProps,
} from '@mui/material/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { Search } from 'lucide-react';
import { symptomDepartmentOperation } from '@/lib/BE-library/main';
import { SymptomResponse } from '@/lib/BE-library/interfaces';

const Root = styled('div')(({ theme }) => ({
  color: 'rgba(0,0,0,0.85)',
  fontSize: '14px',
  width: '100%',
  position: 'relative',
  ...theme.applyStyles('dark', {
    color: 'rgba(255,255,255,0.65)',
  }),
}));

const InputWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  border: 'none',
  backgroundColor: 'transparent',
  borderRadius: '8px',
  padding: '8px 1px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: '6px',
  height: '76px', // Fixed height to accommodate 2 rows of tags + input
  overflowY: 'hidden', // Hide any overflow
  '& input': {
    backgroundColor: 'transparent',
    color: 'rgb(17 24 39)',
    height: '28px',
    boxSizing: 'border-box',
    padding: '4px 0',
    width: '0',
    minWidth: '150px', // Smaller minimum width to fit better
    flexGrow: 1,
    flexShrink: 1,
    border: 0,
    margin: 0,
    outline: 0,
    fontSize: '16px',
    lineHeight: '20px',
    '&::placeholder': {
      color: 'rgb(107 114 128)',
    },
    ...theme.applyStyles('dark', {
      color: 'rgba(255,255,255,0.65)',
    }),
  },
}));



interface ItemProps extends ReturnType<AutocompleteGetItemProps<true>> {
  label: string;
}

function Item(props: ItemProps) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

const StyledItem = styled(Item)<ItemProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '26px',
  margin: '2px',
  lineHeight: '22px',
  backgroundColor: '#e6f7ff',
  border: `1px solid #91d5ff`,
  borderRadius: '13px',
  boxSizing: 'border-box',
  padding: '0 8px 0 10px',
  outline: 0,
  overflow: 'hidden',
  fontSize: '12px',
  fontWeight: 500,
  color: '#0050b3',
  flexShrink: 0, // Prevent tags from shrinking
  maxWidth: '150px', // Limit individual tag width
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: '#303030',
  }),
  '&:focus': {
    borderColor: '#40a9ff',
    backgroundColor: '#bae7ff',
    ...theme.applyStyles('dark', {
      backgroundColor: '#003b57',
      borderColor: '#177ddc',
    }),
  },
  '& span': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '100px',
  },
  '& svg': {
    fontSize: '12px',
    cursor: 'pointer',
    padding: '2px',
    marginLeft: '4px',
    color: '#0050b3',
    flexShrink: 0,
    '&:hover': {
      color: '#ff4d4f',
    },
  },
}));

const Listbox = styled('ul')(({ theme }) => ({
  width: 'calc(100% - 16px)', // Slightly narrower to match visual width
  left: '8px', // Center align with input content
  margin: '12px 0 0', // More spacing from search bar
  padding: 0,
  position: 'absolute',
  listStyle: 'none',
  backgroundColor: '#fff',
  overflowY: 'auto',
  maxHeight: '240px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  zIndex: 50,
  border: '1px solid #e5e7eb',
  
  // Hide scrollbar
  msOverflowStyle: 'none', // IE and Edge
  scrollbarWidth: 'none', // Firefox
  '&::-webkit-scrollbar': {
    display: 'none', // Chrome, Safari, Opera
  },
  ...theme.applyStyles('dark', {
    backgroundColor: '#141414',
    borderColor: '#374151',
  }),
  '& li': {
    padding: '8px 12px',
    display: 'flex',
    cursor: 'pointer',
    fontSize: '14px',
    '& span': {
      flexGrow: 1,
    },
    '& svg': {
      color: 'transparent',
    },
  },
  "& li[aria-selected='true']": {
    backgroundColor: '#f0f9ff',
    fontWeight: 500,
    color: '#0369a1',
    ...theme.applyStyles('dark', {
      backgroundColor: '#2b2b2b',
    }),
    '& svg': {
      color: '#0369a1',
    },
  },
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: '#f8fafc',
    ...theme.applyStyles('dark', {
      backgroundColor: '#003b57',
    }),
    '& svg': {
      color: 'currentColor',
    },
  },
  '& li:hover': {
    backgroundColor: '#f8fafc',
  },
}));

const MoreTag = styled('div')({
  display: 'flex',
  alignItems: 'center',
  height: '26px',
  margin: '2px',
  lineHeight: '22px',
  backgroundColor: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '13px',
  boxSizing: 'border-box',
  padding: '0 10px',
  fontSize: '12px',
  fontWeight: 500,
  color: '#6b7280',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  zIndex: 1,
});

interface SymptomAutocompleteProps {
  onSelectionChange: (symptoms: SymptomResponse[]) => void;
  placeholder?: string;
  initialValues?: SymptomResponse[];
}

function SymptomAutocomplete({ onSelectionChange, placeholder, initialValues = [] }: SymptomAutocompleteProps) {
  const [symptoms, setSymptoms] = useState<SymptomResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch symptoms from API
  useEffect(() => {
    const fetchSymptoms = async () => {
      setLoading(true);
      try {
        const result = await symptomDepartmentOperation.getAllSymptoms();
        if (result.success && result.data) {
          setSymptoms(result.data);
        }
      } catch (error) {
        console.error('Error fetching symptoms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  const {
    getRootProps,
    getInputProps,
    getItemProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    multiple: true,
    options: symptoms,
    getOptionLabel: (option) => option.name,
    value: initialValues,
    onChange: (_, newValue) => {
      // Allow unlimited selection, display logic will handle the "+... more"
      onSelectionChange(newValue as SymptomResponse[]);
    },
    // Keep dropdown open when selecting options but allow outside click to close
    disableCloseOnSelect: true,
    openOnFocus: true,
    blurOnSelect: false,
  });

  return (
    <Root {...getRootProps()}>
      <div>
        <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
          <Search className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-2" />
          {value.slice(0, 5).map((option, index) => {
            const { key, ...itemProps } = getItemProps({ index });
            return (
              <StyledItem
                key={key}
                {...itemProps}
                label={option.name}
              />
            );
          })}
          {value.length > 5 && (
            <MoreTag>
              +{value.length - 5}more
            </MoreTag>
          )}
          <input 
            {...getInputProps()} 
            placeholder={value.length === 0 ? (placeholder || "Nhập triệu chứng của bạn...") : ""}
          />
        </InputWrapper>
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {loading ? (
              <li style={{ padding: '12px', textAlign: 'center', color: '#6b7280' }}>
                Đang tải triệu chứng...
              </li>
            ) : (
              (groupedOptions as SymptomResponse[]).map((option, index) => {
                const { key, ...optionProps } = getOptionProps({ option, index });
                return (
                  <li key={key} {...optionProps}>
                    <span>{option.name}</span>
                    <CheckIcon fontSize="small" />
                  </li>
                );
              })
            )}
          </Listbox>
        ) : null}
      </div>
    </Root>
  );
}

export default SymptomAutocomplete;
