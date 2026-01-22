import * as React from 'react';
import { Autocomplete } from '../src/components/autocomplete/autocomplete';

export default {
  title: 'Autocomplete',
  component: Autocomplete,
};

// Sample data
const fruits = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
  'Honeydew',
  'Kiwi',
  'Lemon',
  'Mango',
  'Orange',
  'Papaya',
  'Quince',
  'Raspberry',
  'Strawberry',
  'Tangerine',
  'Watermelon',
];

const complexItems = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nuxtjs', label: 'Nuxt.js' },
];

// Basic autocomplete story
export const Default = () => {
  const [value, setValue] = React.useState('');

  return (
    <Autocomplete
      items={fruits}
      value={value}
      filterSuggestions={true}
      autoHighlight={true}
      onChange={(e, val) => setValue(val)}
      onSelect={(val) => setValue(val)}
      inputProps={{
        placeholder: 'Type to search fruits...',
        style: { width: '300px', padding: '8px' },
      }}
    />
  );
};

// Complex items with custom labels
export const OptionItems = () => {
  const [value, setValue] = React.useState('');

  return (
    <Autocomplete
      items={complexItems}
      value={value}
      filterSuggestions={true}
      autoHighlight={true}
      onChange={(e, val) => setValue(val)}
      onSelect={(val) => setValue(val)}
      inputProps={{
        placeholder: 'Select a framework...',
        style: { width: '300px', padding: '8px' },
      }}
    />
  );
};

// Custom render item
export const CustomRenderItem = () => {
  const [value, setValue] = React.useState('');

  return (
    <Autocomplete
      items={complexItems}
      value={value}
      filterSuggestions={true}
      autoHighlight={true}
      onChange={(e, val) => setValue(val)}
      onSelect={(val) => setValue(val)}
      inputProps={{
        placeholder: 'Select a framework...',
        style: { width: '300px', padding: '8px' },
      }}
      renderItem={(item) => (
        <div
          style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}
        >
          <span
            style={{
              backgroundColor: '#007acc',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '12px',
              marginRight: '8px',
            }}
          >
            JS
          </span>
          {item.label}
        </div>
      )}
    />
  );
};

// Custom input render
export const CustomInput = () => {
  const [value, setValue] = React.useState('');

  return (
    <Autocomplete
      items={fruits}
      value={value}
      filterSuggestions={true}
      autoHighlight={true}
      onChange={(e, val) => setValue(val)}
      onSelect={(val) => setValue(val)}
      renderInput={(props) => (
        <div style={{ position: 'relative' }}>
          <input
            {...props}
            style={{
              width: '300px',
              padding: '12px 40px 12px 12px',
              border: '2px solid #007acc',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
            }}
            placeholder='🔍 Search fruits...'
          />
          <span
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
              fontSize: '18px',
            }}
          >
            ⌄
          </span>
        </div>
      )}
    />
  );
};

// Glob pattern matching
export const GlobPattern = () => {
  const [value, setValue] = React.useState('');

  const fileItems = [
    'component.ts',
    'component.spec.ts',
    'component.scss',
    'service.ts',
    'service.spec.ts',
    'model.ts',
    'utils.ts',
    'utils.spec.ts',
    'index.ts',
    'main.scss',
    'theme.scss',
  ];

  return (
    <div>
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
        Try glob patterns like: *.ts, *.spec.*, component.*, etc.
      </div>
      <Autocomplete
        items={fileItems}
        value={value}
        glob={true}
        filterSuggestions={false}
        autoHighlight={true}
        onChange={(e, val) => setValue(val)}
        onSelect={(val) => setValue(val)}
        inputProps={{
          placeholder: 'Try patterns like *.ts, *.spec.*, component.*',
          style: { width: '350px', padding: '8px' },
        }}
      />
    </div>
  );
};
