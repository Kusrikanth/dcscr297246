// TipTapIframeExtension.tsx

import { Node, mergeAttributes } from '@tiptap/core';

export interface IframeOptions {
  allowFullscreen: boolean;
  HTMLAttributes: {
    [key: string]: any;
  };
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * Add an iframe
       */
      setIframe: (options: { src: string }) => ReturnType;
    };
  }
}

export const Iframe = Node.create<IframeOptions>({
  name: 'iframe',
  group: 'block',
  atom: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: 'tiptap-iframe-wrapper', // Changed from w-full aspect-video to a custom class
      },
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
    };
  },

  parseHTML() {
    return [{
      tag: 'iframe[src]',
    }];
  },

  renderHTML({ HTMLAttributes }) {
    // The wrapper div is essential for positioning and styling in TipTap
    return ['div', { 'data-iframe-wrapper': '', class: 'tiptap-iframe-wrapper' }, ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]];
  },

  addCommands() {
    return {
      setIframe: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});