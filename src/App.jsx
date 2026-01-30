import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import config from './portfolio.config.json'

const blogModules = import.meta.glob('./blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function nonEmpty(value) {
  return typeof value === 'string' ? value.trim().length > 0 : Boolean(value)
}

function LinkItem({ label, href }) {
  if (!nonEmpty(href)) return null
  return (
    <a className="link" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}

function Tag({ children }) {
  return <span className="tag">{children}</span>
}

function Card({ title, meta, children, actions }) {
  return (
    <div className="card">
      <div className="cardHeader">
        <div className="cardTitleRow">
          <div className="cardTitle">{title}</div>
          {meta ? <div className="cardMeta">{meta}</div> : null}
        </div>
        <div className="cardRule" />
      </div>
      <div className="cardBody">{children}</div>
      {actions ? <div className="cardActions">{actions}</div> : null}
    </div>
  )
}

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="section">
      <div className="sectionHeader">
        <h2 className="sectionTitle">{title}</h2>
        {subtitle ? <div className="sectionSubtitle">{subtitle}</div> : null}
      </div>
      <div className="sectionBody">{children}</div>
    </section>
  )
}

export default function App() {
  const { meta, profile, links, training, certifications, projects, experience, programming, otherSections, footer } = config

  const blogPosts = useMemo(() => {
    return Object.entries(blogModules)
      .map(([path, content]) => {
        const file = String(path).split('/').pop() || ''
        const slug = file.replace(/\.md$/i, '')
        const title = (String(content).match(/^#\s+(.+)$/m) || [])[1] || slug
        const date = (slug.match(/^(\d{4}-\d{2}-\d{2})-/) || [])[1] || ''
        return { slug, title, date, content: String(content) }
      })
      .sort((a, b) => b.slug.localeCompare(a.slug))
  }, [])

  const [activePostSlug, setActivePostSlug] = useState(blogPosts[0]?.slug || '')
  const activePost = blogPosts.find((p) => p.slug === activePostSlug) || blogPosts[0] || null

  return (
    <div className="app">
      <div className="scanlines" aria-hidden="true" />

      <header className="header">
        <div className="topbar">
          <div className="brand">
            <div className="brandTitle">{meta.siteTitle}</div>
            <div className="brandTagline">{meta.tagline}</div>
          </div>

          <nav className="nav">
            <a className="navLink" href="#training">training</a>
            <a className="navLink" href="#certs">certs</a>
            <a className="navLink" href="#projects">projects</a>
            <a className="navLink" href="#blog">blog</a>
            <a className="navLink" href="#experience">experience</a>
            <a className="navLink" href="#programming">code</a>
            <a className="navLink" href="#other">other</a>
            <a className="navLink" href="#contact">contact</a>
          </nav>
        </div>

        <div className="hero">
          <pre className="ascii" aria-label="banner">
            {profile.asciiBanner.join('\n')}
          </pre>

          <div className="heroRight">
            <div className="terminal">
              <div className="terminalHeader">
                <div className="terminalDots">
                  <span className="dot dotRed" />
                  <span className="dot dotYellow" />
                  <span className="dot dotGreen" />
                </div>
                <div className="terminalTitle">session: {profile.handle}</div>
              </div>

              <div className="terminalBody">
                <div className="promptLine">
                  <span className="prompt">$</span> whoami
                </div>
                <div className="outputLine">
                  {profile.name} — {profile.role}
                </div>

                {nonEmpty(profile.headline) ? (
                  <>
                    <div className="promptLine">
                      <span className="prompt">$</span> title
                    </div>
                    <div className="outputLine">{profile.headline}</div>
                  </>
                ) : null}

                <div className="promptLine">
                  <span className="prompt">$</span> location
                </div>
                <div className="outputLine">{profile.location}</div>

                <div className="promptLine">
                  <span className="prompt">$</span> cat summary.txt
                </div>
                <div className="outputLine">{profile.summary}</div>

                <div className="promptLine">
                  <span className="prompt">$</span> focus --list
                </div>
                <div className="tags">
                  {profile.focusAreas.map((x) => (
                    <Tag key={x}>{x}</Tag>
                  ))}
                </div>
              </div>
            </div>

            <div className="linksRow">
              <LinkItem label="github" href={links.github} />
              <LinkItem label="linkedin" href={links.linkedin} />
              <LinkItem label="blog" href={links.blog} />
              <LinkItem label="resume" href={links.resume} />
              <LinkItem label="tryhackme" href={links.tryhackme} />
              <LinkItem label="hackthebox" href={links.hackthebox} />
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        {Array.isArray(training) && training.length > 0 ? (
          <Section id="training" title="Training" subtitle="Structured learning + hands-on labs">
            <div className="grid">
              {training.map((t) => (
                <Card
                  key={`${t.name}-${t.status}`}
                  title={t.name}
                  meta={[t.status, t.issued].filter(Boolean).join(' | ')}
                  actions={
                    nonEmpty(t.url) ? (
                      <a className="button" href={t.url} target="_blank" rel="noreferrer">
                        details
                      </a>
                    ) : null
                  }
                >
                  {t.notes ? <div className="muted">{t.notes}</div> : null}
                </Card>
              ))}
            </div>
          </Section>
        ) : null}

        <Section
          id="certs"
          title="Certifications"
          subtitle="Proof-of-skill, continuously updated"
        >
          <div className="grid">
            {certifications.map((c) => (
              <Card
                key={`${c.name}-${c.issued}`}
                title={c.name}
                meta={[c.issuer, c.status, c.issued].filter(Boolean).join(' | ')}
                actions={
                  nonEmpty(c.credentialUrl) ? (
                    <a className="button" href={c.credentialUrl} target="_blank" rel="noreferrer">
                      view credential
                    </a>
                  ) : null
                }
              >
                {c.notes ? <div className="muted">{c.notes}</div> : null}
              </Card>
            ))}
          </div>
        </Section>

        <Section id="projects" title="Projects" subtitle="Hands-on work (lab + real-world tooling)">
          <div className="grid">
            {projects.map((p) => (
              <Card
                key={p.name}
                title={p.name}
                meta={[p.type, p.stack?.join(' · ')].filter(Boolean).join(' | ')}
                actions={
                  <div className="actionsInline">
                    {nonEmpty(p.repoUrl) ? (
                      <a className="button" href={p.repoUrl} target="_blank" rel="noreferrer">
                        repo
                      </a>
                    ) : null}
                    {nonEmpty(p.liveUrl) ? (
                      <a className="button" href={p.liveUrl} target="_blank" rel="noreferrer">
                        live
                      </a>
                    ) : null}
                  </div>
                }
              >
                <div className="desc">{p.description}</div>
                {Array.isArray(p.highlights) && p.highlights.length > 0 ? (
                  <ul className="list">
                    {p.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                ) : null}
              </Card>
            ))}
          </div>
        </Section>

        {blogPosts.length > 0 ? (
          <Section id="blog" title="Blog" subtitle="Blogs for the community">
            <div className="blogLayout">
              <div className="blogSidebar">
                <Card title="Posts" meta={`${blogPosts.length} total`}>
                  <div className="postList">
                    {blogPosts.map((p) => {
                      const isActive = p.slug === activePost?.slug
                      return (
                        <button
                          key={p.slug}
                          type="button"
                          className={`postItem${isActive ? ' postItemActive' : ''}`}
                          onClick={() => setActivePostSlug(p.slug)}
                        >
                          <div className="postTitle">{p.title}</div>
                          {p.date ? <div className="postMeta">{p.date}</div> : null}
                        </button>
                      )
                    })}
                  </div>
                </Card>
              </div>

              <div className="blogContent">
                <Card title={activePost?.title || 'Post'} meta={activePost?.date || null}>
                  {activePost ? (
                    <div className="markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{activePost.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="muted">No posts found.</div>
                  )}
                </Card>
              </div>
            </div>
          </Section>
        ) : null}

        {Array.isArray(experience) && experience.length > 0 ? (
          <Section id="experience" title="Practical Security Experience" subtitle="Applied security in real environments">
            <div className="grid">
              {experience.map((e) => (
                <Card
                  key={`${e.title}-${e.type}`}
                  title={e.title}
                  meta={e.type}
                  actions={
                    nonEmpty(e.url) ? (
                      <a className="button" href={e.url} target="_blank" rel="noreferrer">
                        reference
                      </a>
                    ) : null
                  }
                >
                  {e.notes ? <div className="desc">{e.notes}</div> : null}
                  {Array.isArray(e.highlights) && e.highlights.length > 0 ? (
                    <ul className="list">
                      {e.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                </Card>
              ))}
            </div>
          </Section>
        ) : null}

        {programming ? (
          <Section id="programming" title={programming.title || 'Programming'} subtitle="Security tooling, automation, and analysis">
            <div className="grid">
              <Card title="Languages" meta={(programming.level || '').trim() || null}>
                {Array.isArray(programming.languages) && programming.languages.length > 0 ? (
                  <div className="tags">
                    {programming.languages.map((x) => (
                      <Tag key={x}>{x}</Tag>
                    ))}
                  </div>
                ) : null}
                {programming.notes ? <div className="muted" style={{ marginTop: 12 }}>{programming.notes}</div> : null}
              </Card>
            </div>
          </Section>
        ) : null}

        <Section id="other" title="Other" subtitle="Everything else that matters">
          <div className="grid">
            {otherSections.map((s) => (
              <Card key={s.id} title={s.title}>
                <ul className="list">
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="contact" title="Contact" subtitle="Reach out for authorized engagements">
          <Card title="Channels" meta={footer.statusLine}>
            <div className="contactGrid">
              <div className="contactRow">
                <div className="contactKey">email</div>
                <div className="contactVal">
                  <a className="link" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                </div>
              </div>

              {nonEmpty(profile.phone) ? (
                <div className="contactRow">
                  <div className="contactKey">phone</div>
                  <div className="contactVal">
                    <a className="link" href={`tel:${profile.phone}`}>
                      {profile.phone}
                    </a>
                  </div>
                </div>
              ) : null}

              <div className="contactRow">
                <div className="contactKey">github</div>
                <div className="contactVal">
                  <a className="link" href={links.github} target="_blank" rel="noreferrer">
                    {links.github}
                  </a>
                </div>
              </div>
              <div className="contactRow">
                <div className="contactKey">linkedin</div>
                <div className="contactVal">
                  <a className="link" href={links.linkedin} target="_blank" rel="noreferrer">
                    {links.linkedin}
                  </a>
                </div>
              </div>
            </div>

            <div className="disclaimer">{footer.disclaimer}</div>
          </Card>
        </Section>
      </main>

      <footer className="footer">
        <div className="footerInner">
          <div className="footerLeft">{profile.handle}@portfolio:~$</div>
          <div className="footerRight">{footer.statusLine}</div>
        </div>
      </footer>
    </div>
  )
}
