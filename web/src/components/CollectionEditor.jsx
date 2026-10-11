import { addItem, removeItem, updateItem, useSiteContent } from '../data/siteStore'
import { Icon } from './Icons'

const toFa = (value) => String(value).replace(/[0-9]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)])

/**
 * Generic add / edit / delete list used by every content collection in the
 * admin panel (destinations, tours, testimonials). `fields` describes the
 * editable keys so no collection needs its own editor component.
 */
export default function CollectionEditor({ collection, fields, blank, addLabel }) {
  const content = useSiteContent()
  const items = content[collection]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">{toFa(items.length)} مورد ثبت شده است.</p>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => addItem(collection, { ...blank })}
        >
          <Icon name="plus" size={17} />
          {addLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="admin-card text-sm text-ink-soft">هنوز موردی ثبت نشده است.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {items.map((item, index) => (
            <li key={`${collection}-${index}`} className="admin-card">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="admin-index">{toFa(index + 1)}</span>
                <button
                  type="button"
                  className="admin-danger"
                  onClick={() => removeItem(collection, index)}
                  aria-label={`حذف مورد ${toFa(index + 1)}`}
                >
                  <Icon name="trash" size={16} />
                  حذف
                </button>
              </div>

              <div className="admin-grid">
                {fields.map((field) => (
                  <label key={field.key} className={`admin-field${field.multiline ? ' admin-field-wide' : ''}`}>
                    <span className="field-label">{field.label}</span>
                    {field.multiline ? (
                      <textarea
                        className="field-control admin-textarea"
                        value={item[field.key] ?? ''}
                        onChange={(event) =>
                          updateItem(collection, index, { [field.key]: event.target.value })
                        }
                      />
                    ) : (
                      <input
                        className="field-control"
                        dir={field.dir}
                        value={item[field.key] ?? ''}
                        onChange={(event) =>
                          updateItem(collection, index, { [field.key]: event.target.value })
                        }
                      />
                    )}
                  </label>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
