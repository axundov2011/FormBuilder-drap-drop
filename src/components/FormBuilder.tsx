import React, { createElement, useRef, useState } from 'react';
import '../assets/formBuilder.scss';
import useFormBuilder, { Element } from './useFormBuilder';
import inputImg from '../assets/Button.png';
import imgLink from '../assets/Image link.png';
import radioGroup from '../assets/Text.png';
import checkBox from '../assets/Social links.png';
import removeIcon from "../assets/remove.png"

interface FormBuilderProps {
  onSave: (content: Element[]) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ onSave }) => {
  console.log('FormBuilder is rendering');
  const { content, addElement, removeElement } = useFormBuilder();
  const dragItem = useRef<HTMLDivElement | null>(null);
  const dragItemOffset = useRef<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrolling, setScrolling] = useState<boolean>(false);
  const [labelValue, setLabelValue] = useState<string>('');
  const [selectValue, setSelectValue] = useState<string>('');
  const [selectOptions, setSelectOptions] = useState<string[]>([]); // State for select options
  const [selectedElement, setSelectedElement] = useState<Element | null>(null); // State for the selected element

  const createHtmlElement = (extension: string) => {
    const htmlElement = document.createElement(extension);
    if (extension === 'input') {
      const labelElement = document.createElement('label');
      labelElement.textContent = ` ${extension}`;

      htmlElement.appendChild(labelElement);
    }

    return htmlElement;
  };

  const handleInputValueChange = (labelElement: HTMLLabelElement, value: string) => {
    const inputValue = inputElement.value;
    const updatedLabel = `${labelValue} - ${inputValue}`;
    labelElement.textContent = updatedLabel;

    const updatedContent = content.map((item) => {
      if (item.labelElement === labelElement) {
        return {
          ...item,
          settings: { value: inputValue },
        };
      }
      return item;
    });

    onSave(updatedContent);
  };

  const handleAddElement = (extension: string) => {
    const containerDiv = document.createElement('div');
    const htmlElement = createHtmlElement(extension);

    switch (extension) {
      case 'input':
        htmlElement.style.width = '100%';
        htmlElement.style.height = '44px';
        htmlElement.style.border = '1px solid #ccc';
        htmlElement.style.borderRadius = '8px';
        htmlElement.style.padding = '10px 14px';
        break;
      case 'select':
        const selectElement = document.createElement('select');
        htmlElement.style.width = '100%';
        htmlElement.style.height = '44px';
        htmlElement.style.border = '1px solid #ccc';
        htmlElement.style.borderRadius = '8px';
        htmlElement.style.padding = '10px 14px';
        htmlElement.style.marginTop = '30px';

        selectOptions.forEach((optionText) => {
          const option = document.createElement('option');
          option.value = optionText;
          option.textContent = optionText;
          selectElement.appendChild(option);
        });
        selectElement.addEventListener('change', (e) => {
          handleInputChange(extension, e.target.value);
        });
        htmlElement.appendChild(selectElement);
        const optionA = document.createElement('option');
        optionA.value = 'Junior';
        optionA.textContent = 'Junior';
        htmlElement.appendChild(optionA);
        const optionB = document.createElement('option');
        optionB.value = 'Midle';
        optionB.textContent = 'Midle';
        htmlElement.appendChild(optionB);
        const optionC = document.createElement('option');
        optionC.value = 'Senior';
        optionC.textContent = 'Senior';
        htmlElement.appendChild(optionC);

        break;
      default:
        break;
    }

    const labelElement = document.createElement('label');
    const inputValue = '';
    labelElement.textContent = `${labelValue} - ${inputValue}`;
    containerDiv.appendChild(labelElement);

    containerDiv.appendChild(htmlElement);

    const container = scrollContainerRef.current;

    if (container) {
      container.appendChild(containerDiv);
    }

    const inputElement = containerDiv.querySelector('input');
    if (inputElement) {
      inputElement.addEventListener('input', () => {
        handleInputValueChange(inputElement, labelElement);
      });
    }


    const newContent = [
      ...content,
      {
        extension,
        settings: { value: inputValue },
        labelElement,
        labelValue,
      },
    ];

    onSave(newContent);
    setSelectedElement(newContent[newContent.length - 1]);

    setLabelValue('');
    handleInputChange(extension, inputValue);


  };

  const handleInputChange = (extension: string, value: string) => {
    console.log('Input changed:', extension, value);

    const index = content.findIndex((item) => item.extension === extension);
    if (index !== -1) {
      const updatedContent = [...content];

      const inputIndex = updatedContent.findIndex((item) => item.extension === 'input');
      if (inputIndex !== -1) {
        const inputElement = updatedContent[inputIndex];
        const labelElement = inputElement.labelElement;
        labelElement.textContent = `${labelValue} - ${value}`;

        updatedContent[inputIndex].settings.value = value;
        onSave(updatedContent);

        const editorLabel = document.getElementById('editorLabel');
        if (editorLabel) {
          editorLabel.textContent = `${labelValue} - ${value}`;
        }
      }
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, extension: string) => {
    dragItem.current = e.currentTarget;
    dragItemOffset.current = e.clientY - dragItem.current.getBoundingClientRect().top;
    e.dataTransfer.setData('application/json', JSON.stringify({ slug: extension, settings: {} }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dragItemHeight = dragItem.current?.offsetHeight || 0;
    const mouseY = e.clientY;

    if (!scrolling && mouseY < dragItemHeight) {
      setScrolling(true);
      scrollContainerRef.current?.classList.add('scrolling');
    } else if (scrolling && mouseY > dragItemHeight) {
      setScrolling(false);
      scrollContainerRef.current?.classList.remove('scrolling');
    }

    if (scrolling) {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const { top, bottom, height } = scrollContainer.getBoundingClientRect();
        const offset = mouseY < top + 50 ? -10 : mouseY > bottom - 50 ? 10 : 0;
        scrollContainer.scrollTop += offset;
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    try {
      const extensionJson = e.dataTransfer.getData('application/json');
      const extension = JSON.parse(extensionJson);

      handleAddElement(extension.slug);
    } catch (error) {
      console.error('Error while handling drop:', error);
    }

    setScrolling(false);
    scrollContainerRef.current?.classList.remove('scrolling');
  };


  const handleRemoveElement = (indexToRemove: number) => {
    const updatedContent = content.filter((_, index) => index !== indexToRemove);
    onSave(updatedContent);
  };

  return (
    <div className="container">
      <div className="column">
        <div className="column-firs">
          <h2>Elements</h2>
          <hr />
          <div
            className="input-column"
            onClick={() => handleAddElement('input')}
            draggable
            onDragStart={(e) => handleDragStart(e, 'input')}
          >
            <div className="previous-content"></div>
            <label htmlFor="" style={{ position: "relative", top: "15px" }}>
              İnput
            </label>            <img className="input-img" src={inputImg} alt="" />
          </div>
          <div
            className="select-column"
            onClick={() => handleAddElement('select')}
            draggable
            onDragStart={(e) => handleDragStart(e, 'select')}
          >
            <div className="previous-content"></div>
            <label htmlFor="" style={{ position: "relative", top: "15px" }}>Select</label>
            <img className="input-img" src={imgLink} alt="" />
          </div>
          <div
            className="input-column"
            onClick={() => handleAddElement('radio')}
            draggable
            onDragStart={(e) => handleDragStart(e, 'radio')}
          >
            <div className="previous-content"></div>
            <label htmlFor="" style={{ position: "relative", top: "15px" }}>Radio group</label>
            <img className="input-img" src={radioGroup} alt="" />
          </div>
          <div
            className="checkbox-column"
            onClick={() => handleAddElement('checkbox')}
            draggable
            onDragStart={(e) => handleDragStart(e, 'checkbox')}
          >
            <div className="previous-content"></div>
            <label htmlFor="" style={{ position: "relative", top: "15px" }}>Checkbox</label>
            <img className="input-img" src={checkBox} alt="" />
          </div>
        </div>
      </div>
      <div
        className="editor-column"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        ref={scrollContainerRef}
      >
        <div>
          <h2>Editor</h2>
          <hr />
        </div>
        <div id='editorLabel'>
          {content.map((element, index) => (
            <div key={index} className="editor-element">
              <span>
                {element.extension} - {JSON.stringify(element.settings)}
              </span>
              <img
                src={removeIcon}
                alt="Remove"
                onClick={() => handleRemoveElement(index)}
                className="remove-icon"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="setting-column">
        <h2>Settings</h2>
        <button onClick={() => onSave(content)}>Save</button>

        <hr />
        <div>
          {content.map((element, index) => (
            <div key={index} className='setting-label' contentEditable={true} onClick={(e) => e.stopPropagation()}>
              {element.labelValue || 'label'}
            </div>
          ))}
          <input
            type="text"
            id="labelInput"
            className='settings-input'
            value={labelValue || ''}
            onChange={(e) => setLabelValue(e.target.value)}
          />
        </div>
        <div>
          <div className='setting-label' contentEditable={true} onClick={(e) => e.stopPropagation()}>
            {selectedElement?.settings.value || 'selectLabel'}
          </div>
          <input
            type="text"
            id="selectInputLabel"
            className='settings-input'
            value={selectedElement?.settings.value || ''}
            onChange={(e) => handleInputChange(selectedElement?.extension || '', e.target.value)}
          />
          <button onClick={() => setSelectOptions(selectValue.split(','))}>Update Select Options</button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;