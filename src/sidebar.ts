import MapInteractions from './mapInteractions';

class Sidebar {
  static mapping: Record<string, any> = {
    bed: {
      title: 'Your Bed',
      icon: 'your_bed',
    },
  };
  private readonly mapInteractions: MapInteractions;
  private collections: string[];

  constructor(mapInteractions: MapInteractions) {
    this.mapInteractions = mapInteractions;
    this.mapInteractions.setListeners(this.listeners);
    this.collections = [];
  }

  private createSidebar(): void {
    const sidebarHtml = `
      <div class="sidebar-pane" id="found-markers">
        <span class="sidebar-close" title="Found Markers"><i class="left-arrow"></i></span>
        <p class="list-title">Found Markers</p>
        <div class="content">
          <ul class="found-list">
          </ul>
        </div>
      </div>
    `;

    $('body').prepend(sidebarHtml);
  }

  private populateSidebar(init = false): void {
    const $collectionList = $('.found-list');

    const hiddenGroups = this.mapInteractions.getHiddenElements();
    hiddenGroups.allmarkers = {
      title: 'All Markers',
      ids: new Set(),
    };
    const labels = $('#sidebar #home label');
    const allKeys = labels.map((_, label) => $(label).attr('for')).get();

    allKeys.forEach((key) => {
      const group = hiddenGroups[key];

      if (!group) return $(`li#${key}`).remove();
      if (this.collections.includes(key)) return;

      const mapped = Sidebar.mapping[key];

      $collectionList.append(
        `<li id="li-${key}">
            <i class="${mapped?.icon || key}"></i>
            <input type="checkbox" class="collection-checkbox cc" id="checkbox-${key}" data-key="${key}" />
            <label class="cl" for="checkbox-${key}">${mapped?.title || group.title}</label>
        </li>`,
      );
    });
    this.collections = Object.keys(hiddenGroups);
    init && this.addEventListeners();
  }

  private addEventListeners(): void {
    $('#found-markers .sidebar-close').on('click', () =>
      $('#found-markers').toggleClass('closed'),
    );
    $(document).on('change', '#checkbox-allmarkers', () => {
      const isChecked = $('#checkbox-allmarkers').is(':checked');

      $('.collection-checkbox:not(#checkbox-allmarkers)').each(function () {
        const checkbox = this as HTMLInputElement;
        checkbox.checked = isChecked;
      });

      if (isChecked) {
        this.mapInteractions.applyGroupVisibility(true);
      } else {
        this.mapInteractions.applyGroupVisibility(false);
      }
    });

    $(document).on(
      'change',
      '.collection-checkbox:not(#checkbox-allmarkers)',
      () => {
        const allCheckboxes = $(
          '.collection-checkbox',
        ) as JQuery<HTMLInputElement>;
        const totalCheckboxes = allCheckboxes.length;
        const checkedCheckboxes = allCheckboxes.filter(':checked').length;

        const allCheckbox = $('#checkbox-allmarkers')[0] as HTMLInputElement;

        if (checkedCheckboxes === totalCheckboxes) {
          allCheckbox.checked = true;
          allCheckbox.indeterminate = false;
        } else if (checkedCheckboxes === 0) {
          allCheckbox.checked = false;
          allCheckbox.indeterminate = false;
        } else {
          allCheckbox.indeterminate = true;
        }

        allCheckboxes.each((index: number, checkbox: HTMLInputElement) => {
          const key = $(checkbox).data('key') as string;
          this.mapInteractions.applyGroupVisibility(checkbox.checked, key);
        });
      },
    );

    $(document).on('change', '.sidebar-content input[type="checkbox"]', () => {
      const allCheckboxes = $(
        '.collection-checkbox',
      ) as JQuery<HTMLInputElement>;

      allCheckboxes.each((index: number, checkbox: HTMLInputElement) => {
        const key = $(checkbox).data('key') as string;
        this.mapInteractions.applyGroupVisibility(checkbox.checked, key);
      });
    });
  }

  private listeners = [
    (marker: L.Marker, id: string, key: string, title: string) => {
      this.populateSidebar();
    },
  ];

  public init(): void {
    this.createSidebar();
    this.populateSidebar(true);
  }
}

export default Sidebar;
