'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { useAppContext } from '../../../context/AppContext';
import Cookies from 'js-cookie';

export default function Select2Form({ title, name, initiallyOpen = false, isProductsPage, options, handleMultiItem, initSelected }) {
  const { state = {}, dispatch = () => { } } = useAppContext() || {};

  // Ensure component is hydrated before rendering dynamic UI
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Ensure selectedOptions is initialized correctly
  const [selectedOptions, setSelectedOptions] = useState(initSelected || []);
  useEffect(() => {
    setSelectedOptions(initSelected || []);
  }, [initSelected]);

  // Memoize newOptions to prevent regeneration on every render
  const newOptions = useMemo(() => {
    if (isProductsPage) {
      if (name === 'catalog') {
        return options?.map(item => ({
          label: item.name,
          value: item.code,
        })) || [];
      } else if (name === 'categories') {
        return options?.map(item => ({
          label: item.description,
          value: item.categoryId,
        })) || [];
      }
    }
    if (name === 'catalog') {
      return options?.catalogs?.map(item => ({
        label: item.name,
        value: item.code,
      })) || [];
    } else if (name === 'categories') {
      return options?.map(item => ({
        label: item.description,
        value: item.categoryId,
      })) || [];
    }
    return [];
  }, [options, name]);

  const handleSelectChange = selected => {
    setSelectedOptions(selected);
    Cookies.set('filterstatus', "filter");
    handleMultiItem(name, selected);
  };

  // Avoid rendering until hydrated and state is ready
  if (!hydrated || !state.LANG) return null;

  return (
    <Disclosure defaultOpen={initiallyOpen || !!initSelected?.length}>
      {({ open: isOpen }) => (
        <div className="accordion-wrapper pp">
          <DisclosureButton
            className="accordion-item w-full flex items-center justify-between cursor-pointer"
          >
            <div className='flex items-center gap-1'>
              {
                name === 'categories' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
                    <image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAHYAAAB2AH6XKZyAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAeNJREFUeJzt2buKFEEYxfGfoyiCRsq6YiAm4kOIpsKC2W7kamZoIIj4FoIKBmZG3l7AVzBYBS+RIMiqmCkLXtk2aBd21u6ZZqjuKpzvD5VUT9d3zpma6q4agiAIgiAIgiAI5pDduQUk5iCu4RL241VeOcOyB89QbWs3sioamNPGzVf4MO2mUc+ihuRox74x/qcAZiICyC0gNxFAbgG5iQByC8hN6gDO4gW+4jEOJx6/aJbw3fib2MMB6y/7902wGqp4k/kKX4YSgJWG+pvTbkrxE1jCE+xruPY2wfhdWWjo+9x30bZvvvrbf6ZvAdu41aBhrc+C5/CtoWiFHzjfZ/EdjPCuQUdva1BJ5mG1RctqH8VKM39Mve/fqeUnDqUuVqL5tRY9d1MXK8n8CBfwsUXPhg6HIdTnaF1YwX3sbbj2GzfVj8HljuPNyhGcVId9fMLnrqrDScIVzSmX2m6nMr5F27Qvsd3RfVZ3ZrMAY9PaBi6nNr7F+wIMtrVf6tW+04I3K6fU29vcZit8wnM8wEU9POfbWMDLCcLumYPDlQhBhIAIARECIgSwiDfaQ5iL/+cnzYRkG5LSaQthPaeooVnEa+MBXM+qqAO7Eo93QL19PoGneJR4/CAIgiAIgiAIgiAFfwDcLJMyIm8KRAAAAABJRU5ErkJggg==" width="64" height="64" />
                  </svg>
                )
              }
              <span className="title">{title}</span>
            </div>
            <i className={`icon-arrow-down-01-round arrow-down ${isOpen ? 'rotate-180' : ''}`}></i>
          </DisclosureButton>

          <DisclosurePanel className="text-gray-500 pp">
            <Select
              className="multi-select"
              placeholder={state.LANG === 'AR' ? 'اختر' : 'Select'}
              isRtl={state.LANG === 'AR'}
              isMulti
              options={newOptions}
              value={selectedOptions}
              onChange={handleSelectChange}
              noOptionsMessage={() => state.LANG === 'AR' ? 'لا يوجد خيارات' : 'No Options'}
            />
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
}
