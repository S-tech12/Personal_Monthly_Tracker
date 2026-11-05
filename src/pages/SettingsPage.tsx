import React from 'react';
import { useSettings } from '../hooks/useSettings';
import { Header } from '../components/common/Header';
import { BottomNav } from '../components/common/BottomNav';
import { Select } from '../components/common/Select';
import { Toggle } from '../components/common/Toggle';
import { SegmentedControl } from '../components/common/SegmentedControl';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useBudget } from '../hooks/useBudget';
import { formatAmountWithCurrency } from '../utils/formatCurrency';
import { MAIN_NAV_ITEMS } from '../constants/navigation';
import { Loader } from '../components/common/Loader';
import { Section } from '../components/layout/Section';
import { BackToTop } from '../components/layout/BackToTop';
import '../styles/pages/SettingsPage.css';
import { categoryService } from '../services/categoryService';
import type { CategoryType, UserCategory } from '../types/category.types';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    isLoading,
    isSaving,
    handleSettingChange,
    handleToggleChange,
    handleSaveChanges
  } = useSettings();

  const {
    categoryBudgets,
    isLoading: isBudgetsLoading,
    handleUpsertCategoryBudget
  } = useBudget();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<string>('');
  const [categoryLimit, setCategoryLimit] = React.useState('');
  const [categories, setCategories] = React.useState<UserCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [newCategoryType, setNewCategoryType] = React.useState<CategoryType>('Debit');
  const [newSubcategory, setNewSubcategory] = React.useState<Record<string, string>>({});

  const loadCategories = React.useCallback(async () => {
    try { setCategories((await categoryService.list()).data.categories); } catch { /* settings remain usable if categories are unavailable */ }
  }, []);

  React.useEffect(() => { loadCategories(); }, [loadCategories]);

  const handleCreateCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await categoryService.create({ name: newCategoryName.trim(), type: newCategoryType });
      setNewCategoryName('');
      await loadCategories();
    } catch (error: any) { window.alert(error.message); }
  };

  const handleAddSubcategory = async (categoryId: string) => {
    const name = newSubcategory[categoryId]?.trim();
    if (!name) return;
    try {
      await categoryService.addSubcategory(categoryId, name);
      setNewSubcategory(current => ({ ...current, [categoryId]: '' }));
      await loadCategories();
    } catch (error: any) { window.alert(error.message); }
  };

  const handleRenameCategory = async (category: UserCategory) => {
    const name = window.prompt('Category name', category.name);
    if (name && name.trim() !== category.name) { await categoryService.update(category._id, { name: name.trim() }); await loadCategories(); }
  };

  const handleRenameSubcategory = async (category: UserCategory, subcategory: UserCategory['subcategories'][number]) => {
    const name = window.prompt('Subcategory name', subcategory.name);
    if (name && name.trim() !== subcategory.name) { await categoryService.updateSubcategory(category._id, subcategory._id, name.trim()); await loadCategories(); }
  };

  const openCategoryModal = (budget: any) => {
    setEditingCategory(budget.category);
    setCategoryLimit(budget.monthlyLimit.toString());
    setIsCategoryModalOpen(true);
  };

  const onSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !categoryLimit) return;
    try {
      const budget = categoryBudgets.find(b => b.category === editingCategory);
      if (budget) {
        await handleUpsertCategoryBudget(editingCategory, parseFloat(categoryLimit), budget.currency);
      }
      setIsCategoryModalOpen(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  const currencyOptions = [
    { label: 'INR - Indian Rupee (₹)', value: 'INR' },
    { label: 'USD - US Dollar ($)', value: 'USD' },
    { label: 'EUR - Euro (€)', value: 'EUR' },
    { label: 'GBP - British Pound (£)', value: 'GBP' }
  ];

  if (isLoading || !settings) {
    return (
      <div className="settings-page">
        <Header title="Spendly" navItems={MAIN_NAV_ITEMS} />
        <Loader text="Loading account settings..." />
        <BottomNav navItems={MAIN_NAV_ITEMS} />
      </div>
    );
  }

  return (
    <div className="settings-page">
      <Header title="Spendly" navItems={MAIN_NAV_ITEMS} />

      {/* Hero Header */}
      <Section variant="gradient" className="settings-hero-section">
        <div className="settings-hero-header">
          <div>
            <div className="settings-hero-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>tune</span>
              <span>Preferences</span>
            </div>
            <h1 className="settings-page-title">Account Settings</h1>
            <p className="settings-page-subhead">
              Customize your default currency, notification frequencies, and automated spend reports.
            </p>
          </div>

          <button 
            type="button" 
            className="save-changes-hero-btn"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            <span className="material-symbols-outlined">save</span>
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </Section>

      {/* Main Settings Sections */}
      <Section variant="plain" withDivider className="settings-content-section">
        <div className="settings-grid-layout">
          {/* Card 1: Preferences */}
          <div className="settings-card-box">
            <div className="settings-box-header">
              <span className="material-symbols-outlined text-primary">payments</span>
              <h2 className="settings-box-title">Regional & Reports</h2>
            </div>
            
            <div className="settings-box-content">
              <div className="settings-field-group">
                <Select 
                  label="Default Transaction Currency"
                  options={currencyOptions}
                  value={settings.defaultCurrency}
                  onChange={(e) => handleSettingChange('defaultCurrency', e.target.value)}
                />
              </div>
              
              <div className="settings-field-group">
                <label className="form-label">
                  Automated Report Frequency
                </label>
                <SegmentedControl 
                  options={['Weekly', 'Monthly']}
                  value={settings.reportFrequency === 'weekly' ? 'Weekly' : 'Monthly'}
                  onChange={(val) => handleSettingChange('reportFrequency', val.toLowerCase())}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Notifications */}
          <div className="settings-card-box">
            <div className="settings-box-header">
              <span className="material-symbols-outlined text-primary">notifications_active</span>
              <h2 className="settings-box-title">Alerts & Notifications</h2>
            </div>
            
            <div className="settings-toggle-list">
              <div className="settings-toggle-item">
                <div>
                  <p className="settings-toggle-title">Budget threshold alerts</p>
                  <p className="settings-toggle-desc">Instant notification upon reaching 80% of limit</p>
                </div>
                <Toggle 
                  checked={settings.notificationPreferences.budgetAlerts}
                  onChange={() => handleToggleChange('budgetAlerts')}
                  aria-label="Toggle budget alerts"
                />
              </div>
              
              <div className="settings-toggle-item">
                <div>
                  <p className="settings-toggle-title">Report delivery emails</p>
                  <p className="settings-toggle-desc">Receive periodic spending breakdown to your inbox</p>
                </div>
                <Toggle 
                  checked={settings.notificationPreferences.reportEmails}
                  onChange={() => handleToggleChange('reportEmails')}
                  aria-label="Toggle report emails"
                />
              </div>
              
              <div className="settings-toggle-item">
                <div>
                  <p className="settings-toggle-title">Unusual spending spikes</p>
                  <p className="settings-toggle-desc">Anomaly detection for unexpected transactions</p>
                </div>
                <Toggle 
                  checked={settings.notificationPreferences.unusualSpendingAlerts}
                  onChange={() => handleToggleChange('unusualSpendingAlerts')}
                  aria-label="Toggle unusual spending"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-card-box mt-6">
          <div className="settings-box-header">
            <span className="material-symbols-outlined text-primary">account_tree</span>
            <h2 className="settings-box-title">My Categories</h2>
          </div>
          <form className="settings-box-content" onSubmit={handleCreateCategory}>
            <div className="settings-field-group">
              <label className="form-label">Category name</label>
              <input className="form-input" value={newCategoryName} onChange={event => setNewCategoryName(event.target.value)} placeholder="e.g. Transportation" />
            </div>
            <div className="settings-field-group">
              <label className="form-label">Transaction type</label>
              <select className="form-input" value={newCategoryType} onChange={event => setNewCategoryType(event.target.value as CategoryType)}>
                <option value="Debit">Debit (Expense)</option>
                <option value="Credit">Credit (Income)</option>
              </select>
            </div>
            <Button type="submit" style={{ alignSelf: 'flex-start' }}>Add Category</Button>
          </form>
          <div className="settings-category-caps-list">
            {categories.length === 0 ? <div style={{ padding: '1rem', color: 'var(--color-on-surface-muted)' }}>Create a category to organize transactions.</div> : categories.map(category => (
              <div key={category._id} className="settings-category-cap-row" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p className="settings-toggle-title">{category.name} <span className="settings-toggle-desc">({category.type})</span></p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0' }}>
                    {category.subcategories.filter(item => item.active).map(subcategory => <span key={subcategory._id} className="settings-toggle-desc" style={{ border: '1px solid var(--color-outline-variant)', borderRadius: '999px', padding: '4px 8px' }}>{subcategory.name} <button type="button" onClick={() => handleRenameSubcategory(category, subcategory)}>✎</button> <button type="button" onClick={async () => { await categoryService.removeSubcategory(category._id, subcategory._id); await loadCategories(); }}>×</button></span>)}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input className="form-input" style={{ maxWidth: '220px' }} value={newSubcategory[category._id] || ''} onChange={event => setNewSubcategory(current => ({ ...current, [category._id]: event.target.value }))} placeholder="Add subcategory" />
                    <Button type="button" variant="outline" onClick={() => handleAddSubcategory(category._id)} style={{ minWidth: 'auto', padding: '8px 12px' }}>Add</Button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button type="button" variant="outline" onClick={() => handleRenameCategory(category)} style={{ minWidth: 'auto', padding: '8px 12px' }}>Edit</Button>
                  <Button type="button" variant="outline" onClick={async () => { await categoryService.remove(category._id); await loadCategories(); }} style={{ minWidth: 'auto', padding: '8px 12px' }}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Limits Quick Reference */}
        <div className="settings-card-box mt-6">
          <div className="settings-box-header">
            <span className="material-symbols-outlined text-primary">category</span>
            <h2 className="settings-box-title">Active Category Caps</h2>
          </div>
          
          <div className="settings-category-caps-list">
            {!isBudgetsLoading && categoryBudgets.length > 0 ? (
              categoryBudgets.map(budget => (
                <div key={budget.category} className="settings-category-cap-row">
                  <div>
                    <p className="settings-toggle-title">{budget.category}</p>
                    <p className="settings-toggle-desc">
                      Monthly ceiling: <strong style={{ color: 'var(--color-on-surface)' }}>{formatAmountWithCurrency(budget.monthlyLimit, budget.currency)}</strong>
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => openCategoryModal(budget)}
                    style={{ padding: '8px 16px', minWidth: 'auto', height: '40px' }}
                  >
                    Edit Limit
                  </Button>
                </div>
              ))
            ) : (
              <div style={{ padding: '1rem', color: 'var(--color-on-surface-muted)' }}>
                No category budgets configured yet.
              </div>
            )}
          </div>
        </div>
      </Section>

      <BackToTop />
      <BottomNav navItems={MAIN_NAV_ITEMS} />

      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Edit Category Limit">
        <form className="modal-form" onSubmit={onSaveCategory}>
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={editingCategory}
              disabled
            />
          </div>
          <div className="form-group">
            <label className="form-label">Monthly Limit ({editingCategory && categoryBudgets.find(b => b.category === editingCategory)?.currency})</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="0.00"
              value={categoryLimit}
              onChange={(e) => setCategoryLimit(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setIsCategoryModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-submit">Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
