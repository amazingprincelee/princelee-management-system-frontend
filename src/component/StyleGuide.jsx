import React from 'react';
import { FaCheck, FaHeart, FaStar, FaUser } from 'react-icons/fa';

const StyleGuide = () => {
  return (
    <div className="p-8 space-y-12 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-gradient-primary mb-4">Style Guide</h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Showcasing the new primary color system (#284ea1) and professional typography
        </p>
      </div>

      {/* Color Palette */}
      <section className="card">
        <h2 className="mb-6">Color Palette</h2>
        
        {/* Primary Colors */}
        <div className="mb-8">
          <h3 className="mb-4">Primary Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-4">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className="text-center">
                <div className={`w-16 h-16 rounded-lg bg-primary-${shade} mx-auto mb-2 shadow-sm`}></div>
                <p className="text-xs font-medium text-neutral-600">{shade}</p>
                <p className="text-xs text-neutral-500">primary-{shade}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="mb-8">
          <h3 className="mb-4">Secondary Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-4">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className="text-center">
                <div className={`w-16 h-16 rounded-lg bg-secondary-${shade} mx-auto mb-2 shadow-sm`}></div>
                <p className="text-xs font-medium text-neutral-600">{shade}</p>
                <p className="text-xs text-neutral-500">secondary-{shade}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Neutral Colors */}
        <div>
          <h3 className="mb-4">Neutral Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-4">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className="text-center">
                <div className={`w-16 h-16 rounded-lg bg-neutral-${shade} mx-auto mb-2 shadow-sm border border-neutral-200`}></div>
                <p className="text-xs font-medium text-neutral-600">{shade}</p>
                <p className="text-xs text-neutral-500">neutral-{shade}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="card">
        <h2 className="mb-6">Typography</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="mb-4">Headings</h3>
            <div className="space-y-3">
              <h1>Heading 1 - Poppins Semibold</h1>
              <h2>Heading 2 - Poppins Semibold</h2>
              <h3>Heading 3 - Poppins Semibold</h3>
              <h4>Heading 4 - Poppins Semibold</h4>
              <h5>Heading 5 - Poppins Semibold</h5>
              <h6>Heading 6 - Poppins Semibold</h6>
            </div>
          </div>

          <div>
            <h3 className="mb-4">Body Text</h3>
            <p className="mb-4">
              This is regular body text using Poppins font family. It's designed to be highly readable 
              and professional for educational applications.
            </p>
            <p className="font-lato">
              This paragraph uses Lato font family as an alternative option for body text.
            </p>
            <p className="font-grotesk">
              This paragraph uses Space Grotesk font family for a more modern, geometric feel.
            </p>
          </div>

          <div>
            <h3 className="mb-4">Font Weights</h3>
            <div className="space-y-2">
              <p className="font-light">Light weight text (300)</p>
              <p className="font-normal">Normal weight text (400)</p>
              <p className="font-medium">Medium weight text (500)</p>
              <p className="font-semibold">Semibold weight text (600)</p>
              <p className="font-bold">Bold weight text (700)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="card">
        <h2 className="mb-6">Button Components</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="mb-4">Primary Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">
                <FaCheck className="mr-2" />
                Primary Button
              </button>
              <button className="btn-primary" disabled>
                Disabled Primary
              </button>
            </div>
          </div>

          <div>
            <h3 className="mb-4">Secondary Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button className="btn-secondary">
                <FaStar className="mr-2" />
                Secondary Button
              </button>
              <button className="btn-secondary" disabled>
                Disabled Secondary
              </button>
            </div>
          </div>

          <div>
            <h3 className="mb-4">Outline Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button className="btn-outline">
                <FaHeart className="mr-2" />
                Outline Button
              </button>
              <button className="btn-outline" disabled>
                Disabled Outline
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Form Elements */}
      <section className="card">
        <h2 className="mb-6">Form Elements</h2>
        
        <div className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Input Field
            </label>
            <input 
              type="text" 
              placeholder="Enter your text here..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Select Dropdown
            </label>
            <select className="input-field">
              <option>Choose an option</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Textarea
            </label>
            <textarea 
              rows="4"
              placeholder="Enter your message..."
              className="input-field"
            ></textarea>
          </div>
        </div>
      </section>

      {/* Cards and Shadows */}
      <section className="space-y-6">
        <h2>Cards and Shadows</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
            <FaUser className="text-primary-600 text-2xl mb-4" />
            <h3>Soft Shadow</h3>
            <p>This card uses the soft shadow utility for subtle elevation.</p>
          </div>

          <div className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6">
            <FaStar className="text-secondary-500 text-2xl mb-4" />
            <h3>Medium Shadow</h3>
            <p>This card uses the medium shadow utility for moderate elevation.</p>
          </div>

          <div className="bg-white rounded-xl shadow-strong border border-neutral-200 p-6">
            <FaHeart className="text-accent-500 text-2xl mb-4" />
            <h3>Strong Shadow</h3>
            <p>This card uses the strong shadow utility for prominent elevation.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StyleGuide;