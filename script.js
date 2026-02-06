class TipCounter {
    constructor() {
        this.tips = [];
        this.storageKey = 'tip_counter_tips';

        this.input = document.getElementById('tip-input');
        this.addBtn = document.getElementById('add-btn');
        this.totalEl = document.getElementById('total-amount');
        this.listEl = document.getElementById('tip-list');
        this.emptyEl = document.getElementById('empty-state');
        this.deleteBtn = document.getElementById('delete-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.actionRow = document.getElementById('action-row');

        this.load();
        this.render();
        this.setupListeners();
    }

    setupListeners() {
        this.addBtn.addEventListener('click', () => this.addFromInput());

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.addFromInput();
        });

        this.deleteBtn.addEventListener('click', () => this.deleteSelected());
        this.clearBtn.addEventListener('click', () => this.clearAll());

        this.listEl.addEventListener('change', (e) => {
            if (e.target.classList.contains('tip-checkbox')) {
                this.updateCheckState(e.target);
                this.updateDeleteButton();
            }
        });
    }

    addFromInput() {
        const raw = this.input.value.trim();
        if (!raw) return;

        const amount = parseFloat(raw);
        if (isNaN(amount) || amount <= 0) return;

        this.addTip(amount);
        this.input.value = '';
        this.input.focus();
    }

    addTip(amount) {
        const rounded = Math.round(amount * 100) / 100;
        this.tips.unshift(rounded);
        this.save();
        this.render();
    }

    deleteSelected() {
        const checkboxes = this.listEl.querySelectorAll('.tip-checkbox:checked');
        if (checkboxes.length === 0) return;

        const indices = new Set();
        checkboxes.forEach(cb => indices.add(parseInt(cb.dataset.index)));

        this.tips = this.tips.filter((_, i) => !indices.has(i));
        this.save();
        this.render();
    }

    clearAll() {
        if (this.tips.length === 0) return;
        if (!confirm('Clear all tips?')) return;

        this.tips = [];
        this.save();
        this.render();
    }

    getTotal() {
        return this.tips.reduce((sum, t) => sum + t, 0).toFixed(2);
    }

    updateCheckState(checkbox) {
        const item = checkbox.closest('.tip-item');
        item.classList.toggle('checked', checkbox.checked);
    }

    updateDeleteButton() {
        const anyChecked = this.listEl.querySelector('.tip-checkbox:checked') !== null;
        this.deleteBtn.disabled = !anyChecked;
    }

    render() {
        this.totalEl.textContent = '$' + this.getTotal();

        this.listEl.innerHTML = '';

        this.tips.forEach((amount, i) => {
            const li = document.createElement('li');
            li.className = 'tip-item';

            const label = document.createElement('label');

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'tip-checkbox';
            cb.dataset.index = i;

            const span = document.createElement('span');
            span.className = 'tip-amount';
            span.textContent = '$' + amount.toFixed(2);

            label.appendChild(cb);
            label.appendChild(span);
            li.appendChild(label);
            this.listEl.appendChild(li);
        });

        const hasTips = this.tips.length > 0;
        this.emptyEl.classList.toggle('hidden', hasTips);
        this.actionRow.classList.toggle('hidden', !hasTips);
        this.deleteBtn.disabled = true;
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tips));
    }

    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) this.tips = JSON.parse(data);
        } catch {
            this.tips = [];
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new TipCounter();
});
