interface HiddenElements {
  [key: string]: {
    title: string;
    ids: Set<string>;
  };
}

class MapInteractions {
  private map: L.Map;
  private readonly hiddenElements: HiddenElements;
  private visibleGroups: Set<string>;
  private markerListeners: Function[];

  constructor(map: L.Map) {
    this.map = map;
    this.hiddenElements = this.loadHiddenElements();
    this.visibleGroups = new Set();
    this.markerListeners = [];
  }

  public setListeners(listeners: Function[]) {
    this.markerListeners = listeners;
  }

  public getHiddenElements() {
    return this.hiddenElements;
  }

  private getMarkerId(latlng: L.LatLng): string {
    return `${latlng.lat}_${latlng.lng}`;
  }

  private getMarkerTitle(marker: L.Marker) {
    return marker.getElement()?.getAttribute('title') as string;
  }

  private isInCollection(key: string, id: string) {
    return this.hiddenElements[key]?.ids.has(id);
  }

  private loadHiddenElements(): HiddenElements {
    const data = localStorage.getItem('hiddenElements');
    if (data) {
      const parsed = JSON.parse(data);
      Object.keys(parsed).forEach((key) => {
        parsed[key].ids = new Set(parsed[key].ids);
      });
      return parsed;
    }
    return {};
  }

  private saveHiddenElements(): void {
    const serializedData = Object.fromEntries(
      Object.entries(this.hiddenElements).map(([key, value]) => [
        key,
        { ...value, ids: Array.from(value.ids) },
      ]),
    );
    localStorage.setItem('hiddenElements', JSON.stringify(serializedData));
  }

  private formatTitle(title: string): string {
    return title
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private parseTitle(titleHtml?: string) {
    let title = '',
      key = '';
    if (titleHtml) {
      if (titleHtml.includes('<span')) {
        const $shadowElement = $(titleHtml);
        title = $shadowElement.text();
        key = $shadowElement.data('i18n');
      } else {
        key = titleHtml;
        title = this.formatTitle(titleHtml);
      }
    }
    return { key, title };
  }

  private toggleInCollection(key: string, title: string, id: string) {
    if (!this.hiddenElements[key]?.ids.has(id)) {
      if (!this.hiddenElements[key]) {
        this.hiddenElements[key] = {
          title,
          ids: new Set(),
        };
      }
      this.hiddenElements[key].ids.add(id);
      return true;
    }

    this.hiddenElements[key].ids.delete(id);
    if (this.hiddenElements[key].ids.size === 0) {
      delete this.hiddenElements[key];
      this.visibleGroups.delete(key);
    }
    return false;
  }

  public init(): void {
    $(document).on('change', '.sidebar-content input[type="checkbox"]', () => {
      this.addListeners();
    });
    this.addListeners();
  }

  private applyVisibility(
    marker: L.Marker,
    show: boolean,
    visited: boolean = false,
  ): void {
    const classList = marker.getElement()?.classList;
    if (!classList) return;
    show ? classList.remove('hidden') : classList.add('hidden');
    visited ? classList.add('visited') : classList.remove('visited');
  }

  private getVisibilityState(key: string, id: string) {
    return !this.isInCollection(key, id) || this.visibleGroups.has(key);
  }

  private getVisitedState(key: string, id: string) {
    return this.isInCollection(key, id) && this.visibleGroups.has(key);
  }

  private addListeners() {
    this.map.eachLayer((layer) => {
      if (layer instanceof unsafeWindow.L.Marker) {
        const id = this.getMarkerId(layer.getLatLng());
        const { key } = this.parseTitle(this.getMarkerTitle(layer));
        this.applyVisibility(
          layer,
          this.getVisibilityState(key, id),
          this.getVisitedState(key, id),
        );
        this.addPointerEventListener(layer);
      }
    });
  }

  private getListener(marker: L.Marker) {
    return () => {
      const id = this.getMarkerId(marker.getLatLng());
      const { key, title } = this.parseTitle(this.getMarkerTitle(marker));
      this.toggleInCollection(key, title, id);
      this.markerListeners.forEach((listener) =>
        listener(marker, id, key, title),
      );
      this.applyVisibility(
        marker,
        this.getVisibilityState(key, id),
        this.getVisitedState(key, id),
      );
      this.saveHiddenElements();
    };
  }

  private addPointerEventListener(marker: L.Marker): void {
    marker.removeEventListener('contextmenu');
    marker.addEventListener('contextmenu', this.getListener(marker), {
      prepend: true,
    });
  }

  public applyGroupVisibility(show: boolean = true, groupKey?: string): void {
    Object.entries(this.hiddenElements).forEach(([key, value]) => {
      if (!groupKey || key === groupKey) {
        show ? this.visibleGroups.add(key) : this.visibleGroups.delete(key);
        value.ids.forEach((id) => {
          this.map.eachLayer((layer) => {
            if (layer instanceof unsafeWindow.L.Marker) {
              const layerId = this.getMarkerId(layer.getLatLng());
              if (layerId === id) {
                this.applyVisibility(
                  layer,
                  show,
                  this.getVisitedState(key, id),
                );
              }
            }
          });
        });
      }
    });
  }
}

export default MapInteractions;
