import { Extension } from "@tiptap/core";

// This interface defines the shape of the data this extension will store.
export interface IndentStorage {
  indentationUnit: string;
}

// This tells TypeScript about our new storage and commands for type-safety.
declare module "@tiptap/core" {
  interface Storage {
    indent: IndentStorage;
  }
  /**
   * Indent extension for Tiptap.
   * This extension provides a `indent` and `outdent` command
   * to change the indentation level of the current block.
   * The `indent` command will increase the indentation level by 1,
   * and the `outdent` command will decrease it by 1.
   * The indentation level is stored in the document's storage
   * under the key `indent.indentationUnit`.
   */
  interface Commands<ReturnType> {
    indent: {
      /**
       * Increase the indentation level of the current block by 1.
       */
      indent: () => ReturnType;
      /**
       * Decrease the indentation level of the current block by 1.
       */
      outdent: () => ReturnType;
    };
  }
}

// Define the type for the options of the Indent extension
export interface IndentOptions {
  types: string[];
  minLevel: number;
  maxLevel: number;
  defaultIndentLevel: number;
}

export const Indent = Extension.create<IndentOptions, IndentStorage>({
  name: "indent",

  // This method initializes the extension's storage.
  addStorage() {
    return {
      indentationUnit: 'rem',
    };
  },

  addOptions() {
    return {
      types: ["heading", "paragraph"],
      minLevel: 0,
      maxLevel: 8,
      defaultIndentLevel: 0,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: this.options.defaultIndentLevel,
            renderHTML: attributes => {
              const indentLevel = attributes.indent;
              if (indentLevel > this.options.minLevel) {
                // We now access the unit from this.storage
                return { style: `margin-left: ${indentLevel * 2}${this.storage.indentationUnit}` };
              }
              return {};
            },
            parseHTML: element => {
              const marginLeft = element.style.marginLeft;
              // We check for the unit from this.storage
              if (marginLeft && marginLeft.endsWith(this.storage.indentationUnit)) {
                const level = Math.round(parseInt(marginLeft, 10) / 2);
                if (level > this.options.minLevel && level <= this.options.maxLevel) {
                  return level;
                }
              }
              return null;
            },
          },
        },
      },
    ];
  },

  addCommands() {
    const applyIndent = (direction: number) => () => ({ tr, state, dispatch, editor }) => {
      
      const { selection } = state;
      let transaction = tr.setSelection(selection);

      const { doc } = transaction;
      if (!doc) return false;

      doc.nodesBetween(selection.from, selection.to, (node, pos) => {
        if (this.options.types.includes(node.type.name)) {
          const currentIndent = node.attrs.indent || 0;
          let newIndent = currentIndent + direction;
          const { minLevel, maxLevel } = this.options;
          newIndent = Math.max(minLevel, Math.min(newIndent, maxLevel));

          if (newIndent !== currentIndent) {
            const nodeAttrs = { ...node.attrs, indent: newIndent };
            transaction = transaction.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
          }
          return false;
        }
        return true;
      });

      if (transaction.docChanged) {
        dispatch?.(transaction);
        return true;
      }
      return false;
    };

    return {
      indent: applyIndent(1),
      outdent: applyIndent(-1),
    };
  },

  addKeyboardShortcuts() {
    return {
      'Control-]': () => this.editor.commands.indent(),
      'Control-[': () => this.editor.commands.outdent(),
    };
  },
});