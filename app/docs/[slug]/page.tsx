import { notFound } from "next/navigation";
import { DocsLayout } from "@/components/docs/docs-layout";
import { DOC_PAGES, getDocPage } from "@/lib/docs/content";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return DOC_PAGES.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: PageProps) {
  const page = getDocPage(params.slug);
  if (!page) return { title: "Not found – DevTalk" };

  return {
    title: `${page.title} – DevTalk Docs`,
    description: page.description,
  };
}

export default function DocArticlePage({ params }: PageProps) {
  const page = getDocPage(params.slug);
  if (!page) notFound();

  return (
    <DocsLayout
      title={page.title}
      description={page.description}
      lastUpdated={page.lastUpdated}
      slug={page.slug}
    >
      {page.sections.map((section, index) => (
        <div key={index}>
          {section.heading ? <h2>{section.heading}</h2> : null}
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.bullets ? (
            <ul>
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </DocsLayout>
  );
}
