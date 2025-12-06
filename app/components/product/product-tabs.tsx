import { useSearchParams } from "react-router";
import { useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import type { IProduct } from "~/interface/product.interface";
import { IngredientsTab } from "./ingredients-tab";
import { HowToUseTab } from "./how-to-use-tab";
import { ReviewsTab } from "./reviews-tab";

interface ProductTabsProps {
  product: IProduct;
  defaultTab?: string;
}

const TAB_VALUES = ["description", "ingredients", "how-to-use", "reviews"] as const;

export function ProductTabs({ product, defaultTab = "description" }: ProductTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || defaultTab;
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    setSearchParams(params);

    // Move focus to tab content and scroll into view
    setTimeout(() => {
      const tabPanel = document.getElementById(`panel-${value}`);
      if (tabPanel) {
        // Focus the tab panel for keyboard users
        tabPanel.focus();
        
        // Scroll the tab content into view smoothly
        tabPanel.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);
  };

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard events when focus is within the tab list
      if (!tabListRef.current?.contains(document.activeElement)) {
        return;
      }

      const currentIndex = TAB_VALUES.indexOf(activeTab as typeof TAB_VALUES[number]);
      let newIndex = currentIndex;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : TAB_VALUES.length - 1;
          break;
        case "ArrowRight":
          e.preventDefault();
          newIndex = currentIndex < TAB_VALUES.length - 1 ? currentIndex + 1 : 0;
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = TAB_VALUES.length - 1;
          break;
        default:
          return;
      }

      if (newIndex !== currentIndex) {
        handleTabChange(TAB_VALUES[newIndex]);
        // Focus the new tab trigger
        setTimeout(() => {
          const newTabTrigger = tabListRef.current?.querySelector(
            `[data-state="active"]`
          ) as HTMLElement;
          newTabTrigger?.focus();
        }, 0);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  return (
    <div id="product-tabs" className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList
          ref={tabListRef}
          role="tablist"
          aria-label="Product information tabs"
          className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto"
        >
          <TabsTrigger
            value="description"
            role="tab"
            aria-controls="panel-description"
            aria-selected={activeTab === "description"}
            id="tab-description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-6 py-3"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="ingredients"
            role="tab"
            aria-controls="panel-ingredients"
            aria-selected={activeTab === "ingredients"}
            id="tab-ingredients"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-6 py-3"
          >
            Ingredients
          </TabsTrigger>
          <TabsTrigger
            value="how-to-use"
            role="tab"
            aria-controls="panel-how-to-use"
            aria-selected={activeTab === "how-to-use"}
            id="tab-how-to-use"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-6 py-3"
          >
            How to Use
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            role="tab"
            aria-controls="panel-reviews"
            aria-selected={activeTab === "reviews"}
            id="tab-reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-6 py-3"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        {/* Description Tab */}
        <TabsContent
          value="description"
          role="tabpanel"
          aria-labelledby="tab-description"
          id="panel-description"
          tabIndex={0}
          className="py-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
        >
          <div className="prose max-w-none">
            {product.description && product.description.length > 0 && (
              <div className="space-y-4 text-gray-700 leading-relaxed">
                {product.description.map((desc, idx) => (
                  <p key={idx} className="text-base">
                    {desc}
                  </p>
                ))}
              </div>
            )}
            {product.benefits && product.benefits.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
                <ul className="space-y-2 list-disc list-inside">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-gray-700">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Ingredients Tab */}
        <TabsContent
          value="ingredients"
          role="tabpanel"
          aria-labelledby="tab-ingredients"
          id="panel-ingredients"
          tabIndex={0}
          className="py-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
        >
          <IngredientsTab ingredients={product.ingredients} />
        </TabsContent>

        {/* How to Use Tab */}
        <TabsContent
          value="how-to-use"
          role="tabpanel"
          aria-labelledby="tab-how-to-use"
          id="panel-how-to-use"
          tabIndex={0}
          className="py-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
        >
          <HowToUseTab instructions={product.howToUse} />
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent
          value="reviews"
          role="tabpanel"
          aria-labelledby="tab-reviews"
          id="panel-reviews"
          tabIndex={0}
          className="py-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
        >
          <ReviewsTab productId={product.productId.toString()} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
