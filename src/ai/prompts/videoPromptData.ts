// Credits to: https://github.com/Lcorinst/AI-Video-Prompt/

// This file contains prompt templates and styles for generating video content using AI models.
// import file videoPomptData.md
export interface VideoPrompt {
    category: string;
    prompts: string[];
}

// export const videoPromptInstructions = videoPromptData;
export const videoPromptTemplate = [
    {
      category: "Cinematic Movie Scene",
      prompts: [
        "{Genre/setting}, {Main character/subject}, {Action}, {Environment details}, {Mood}, {Camera techniques}, {Lighting style}",
        "An epic fantasy battle scene at dusk on a misty plain. A lone knight rises from the ground and draws a glowing sword as armies charge behind him. Slow-motion highlights dust and embers in the air, with dramatic backlighting casting a heroic silhouette, and the camera pulls back in a wide, sweeping shot to reveal the scale of the conflict.",
        "A film noir detective scene in a 1940s city. A trench-coated detective walks down a dim alley under flickering streetlamps in pouring rain. Low-key lighting and deep shadows create mystery. The camera follows in a tracking shot from behind, then cuts to a close-up of water dripping off his hat as jazzy music plays in the background."
      ]
    },
    {
      category: "Animation/Cartoon Sequence",
      prompts: [
        "{Animation style}, {Characters/creatures}, {Action/story}, {Visual style}, {Stylistic influences}, {Camera movements}, {Lighting conditions}",
        "A Pixar-style 3D animated scene of two talking cats on a rooftop at sunset. One cat strums a guitar while the other sings. The style is cute and cartoonish with vibrant colors and exaggerated expressions. Soft, warm lighting from the setting sun creates long shadows, and the camera does a slow zoom as they perform, capturing a heartwarming mood.",
        "A 2D anime action sequence in a futuristic city. A cyberpunk hero with a neon visor leaps between hovering cars, chasing a villain. The visual aesthetic is high-energy anime, with dynamic motion lines and glowing neon lights against a dark skyline. The scene uses quick cuts and a dramatic angle from below to intensify the action."
      ]
    },
    {
      category: "Fashion Show Runway",
      prompts: [
        "{Venue/theme}, {Model(s) and attire}, {Actions/poses}, {Atmosphere}, {Camera work}, {Lighting descriptors}, {Overall vibe}",
        "A high-fashion runway scene in Paris, inside a grand hall with a reflective black floor. A model in an avant-garde red gown glides down the catwalk. Bright white spotlights follow her every move, and camera flashes sparkle from the audience. The camera shoots in slow motion as the gown’s train billows, capturing an elegant and dramatic vibe with each step.",
        "A summer beachwear fashion show at an outdoor seaside venue. Models in light, tropical outfits walk barefoot on a sand-covered runway. The atmosphere is casual and upbeat – natural golden-hour lighting and tiki torches provide a warm glow. A drone camera gives an aerial shot of the runway by the waves, then cuts to a close-up of a model’s flowing cover-up as music pumps."
      ]
    },
    {
      category: "Product Showcase/Advertisement",
      prompts: [
        "{Product}, {Setting/backdrop}, {Demonstration}, {Visual style}, {Text/graphics overlays}, {Camera movements}, {Brand style}",
        "A commercial showcasing the latest smartphone. The phone rotates slowly against a clean white background while soft studio lighting highlights its glossy finish. Close-up shots show the camera lens and edge-to-edge screen. Then, the scene cuts to the phone in use: a person snapping a photo at night, and the image is crystal clear – demonstrating the low-light camera feature with a text overlay. The style is sleek, high-tech, and cinematic, with a smooth tracking shot following the phone’s movement.",
        "A product demo video for a blender in a kitchen setting. A presenter blends a variety of fruits; the prompt details the blender’s stainless steel design and bright digital display. Natural morning light fills the kitchen, giving a fresh feel. Shots alternate between wide shots of the whole counter and close-ups of the blender’s blades in action, even a slow-motion segment of fruit swirling. The prompt ends with the blender pouring a smoothie, emphasizing a vibrant, healthy-lifestyle vibe."
      ]
    },
    {
      category: "Nature Documentary Segment",
      prompts: [
        "{Location and time}, {Subject}, {Action/behavior}, {Sensory details}, {Camera style}, {Lighting conditions}, {Narrative tone}",
        "A nature documentary scene at dawn on the African savannah. A herd of elephants gathers around a watering hole, mist rising as the first light of day paints the sky in pastel hues. The camera begins with an aerial wide shot showing the vast golden plains, then zooms in to a close-up of a mother elephant guiding her calf to drink. Soft, natural lighting and a gentle pan across the scene create a serene, majestic mood, as a calm narration (not seen) describes their morning routine.",
        "An underwater documentary clip in a coral reef. A sea turtle glides through crystal-clear water over colorful corals while schools of fish scatter. The scene is described with vivid color detail – bright oranges and blues of the reef. Sun rays pierce the water from above, illuminating the turtle in shafts of light. The camera follows in steady tracking shots, occasionally shifting to slow motion to capture the turtle nibbling on seagrass, conveying an intimate look at marine life."
      ]
    },
    {
      category: "Travel Vlog or Adventure Video",
      prompts: [
        "{Destination/setting}, {Traveler/host}, {Activities/sights}, {Shot variety}, {Atmosphere}, {Text/voice-over style}, {Tone}",
        "A travel vlog in Tokyo at night. The prompt follows a vlogger walking through Shibuya Crossing, neon signs and crowds all around. Handheld first-person camera captures the energy – bright billboards in vibrant colors, people rushing by. Time-lapse segments show the scramble crossing from above, the flow of people like currents. Then we cut to the vlogger enjoying street food at a night market, shot in close-up to show steaming takoyaki. The video style is energetic and immersive, with quick cuts and POV angles that make the viewer feel present in the bustling city.",
        "An adventure travel montage in New Zealand. It opens with a drone shot soaring over snow-capped mountains and a valley of green. The traveler is seen hiking a ridge (captured in a wide long shot to show scale), then switches to first-person perspective crossing a swinging bridge. Scenes of kayaking in a turquoise lake and camping under a starry sky are described. The prompt highlights natural colors – lush greens, deep blue water, golden sunlight – and uses smooth transitions (a slow fade from the mountain to the lake scene) to create a dreamy, inspiring journey feel."
      ]
    },
    {
      category: "Music Video Performance",
      prompts: [
        "{Artist/band}, {Performance setting}, {Camera movements}, {Lighting}, {Concept/storyline elements}, {Visual alignment}",
        "A rock music video set in an abandoned warehouse. The band performs on a makeshift stage, the lead singer belting into the mic while the guitarist leaps. Dynamic lighting flashes in time with the drum beats – think strobing red and blue lights in the dark space. The camera is very active: handheld close-ups on the singer’s face for the chorus, rapid cuts to the drummer’s solo with flying drumsticks, and a 360° tracking shot circling the band during the climactic guitar riff. Sparks fly (literally) from a rig behind the stage as the final chord hits, matching the high energy.",
        "A pop music video on a rooftop at sunset. The singer dances on the edge of the roof with the city skyline behind her. Golden hour light casts a warm glow on the scene. The prompt describes smooth, floating camera movements – a continuous crane shot that starts behind the singer, rises up above her during the chorus, and then swoops around to reveal a group of backup dancers. Slow-motion is used on a few beats as she flips her hair, emphasizing emotional moments in the soft pop ballad. The style feels cinematic and emotive, matching the song’s uplifting tone."
      ]
    },
    {
      category: "Sports Highlight or Action Sequence",
      prompts: [
        "{Sport/action}, {Main athlete/participants}, {Moment/skill}, {Camera techniques}, {Dynamic angles}, {Crowd/stadium effects}, {Pacing}",
        "A basketball game highlight: last seconds of the championship. Player 23 sprints down the court and leaps for a slam dunk. The camera follows in slow motion as he takes off, showing sweat and determination on his face. We see an over-the-rim angle of the ball smashing through the hoop. Immediately the view cuts to a wide shot of the arena as the buzzer sounds, crowd erupting (fans jumping in blurred background). High-contrast lighting highlights the players against the bright arena. The prompt captures the intensity with quick cuts and a dramatic replay from a floor-level camera as the dunk happens.",
        "A skateboarding video at an urban skate park. The scene focuses on one skater about to attempt a big trick: a 360º kickflip off a stair set. As he launches, the prompt describes a slow-motion mid-air shot — the skateboard flips beneath him, sunlight gleaming off its underside. Then a GoPro-style POV shows the landing from the skater’s eyes. We get a low-angle shot from the ground as he lands smoothly. The video style is gritty and quick-cut, occasionally switching to fisheye lens (a common skate video look) to follow the action closely, matching the edgy, exciting tone."
      ]
    },
    {
      category: "News Report or Broadcast Segment",
      prompts: [
        "{Context}, {Anchor/reporter}, {Topic}, {Camera angles}, {Graphics/headlines}, {Props/surroundings}, {Tone}",
        "A TV news broadcast in a modern studio. An anchor in a navy suit sits at a news desk, with a large screen behind showing the headline ‘Global Markets Update’. Even, cool lighting illuminates the desk. The prompt describes the camera on a medium shot of the anchor, who shuffles papers and begins speaking. A ticker tape with scrolling text is visible at the bottom of the frame. Then it switches to a split-screen showing the anchor on one side and footage of stock traders on the other. The style is polished and straightforward, just like a live news broadcast.",
        "A field news report from a storm site. A reporter in a raincoat stands in front of a flooded street, holding a microphone with a network logo. It’s windy and raining – you can see raindrops on the camera lens and the reporter’s hair whipping. The camera is a handheld shot to convey urgency, occasionally zooming to show rescue workers in the background. On-screen, a graphic in the corner reads ‘Breaking News – Flood Aftermath’. The prompt maintains a serious, urgent tone, capturing the look and feel of a live breaking-news segment."
      ]
    },
    {
      category: "Educational Explainer or Tutorial",
      prompts: [
        "{Topic}, {Presenter/format}, {Setting}, {Visual elements}, {Demonstration focus}, {Camera focus}, {Style/tone}",
        "A science explainer video about volcanoes. A presenter in a lab coat stands beside a table with a small volcano model. In a bright studio setting with graphics screens, she pours vinegar into a baking soda volcano model. The prompt describes a close-up as it foams and erupts, then cuts to a graphic overlay showing a cross-section of a real volcano (labeled diagram with lava chamber, etc.). The visuals are clean and instructive – the camera alternates between the presenter (medium shot as she explains) and supportive graphics. The tone is educational and engaging, as if a teacher is giving a mini-lesson.",
        "A cooking tutorial video for making pasta carbonara. It opens with an overhead shot of ingredients laid out neatly on a kitchen counter. Hands appear and begin the process: cracking eggs, grating cheese. The prompt provides a step-by-step visual: a close-up of eggs being whisked (with a subtitle “Step 1: Prepare the sauce”), then a cut to the stove where pancetta sizzles in a pan. The kitchen is well-lit with natural light for clarity. The camera occasionally switches to a front angle where the cook briefly appears explaining tips, then back to the overhead view. The style is clear, step-by-step, and friendly, making it easy for viewers to follow along."
      ]
    },
    {
      category: "Video Game Cinematic / Fantasy Cutscene",
      prompts: [
        "{Theme/genre}, {Characters/heroes}, {Environment}, {Action/dialogue}, {Camera techniques}, {Visual effects}, {Cinematic quality}",
        "A video game cutscene in a medieval fantasy realm. The elven queen stands on a balcony of a towering tree palace, overlooking her army gathered below in a moonlit forest. The camera cranes from the crowd up to her, showing her determined expression. She raises a glowing staff – sparkling magical particles swirl around her. The style is hyper-realistic CGI with intricate detail on her flowing gown and the ancient tree architecture. A close-up reveals a tear on her cheek as she gives a silent nod. Then dramatic music swells and the scene fades out. It feels like a pivotal cinematic moment in an RPG, full of awe and emotion.",
        "A sci-fi game cinematic on a distant planet. A space marine in futuristic armor takes off his helmet in a barren alien landscape with two setting suns. The visuals are cinematic and atmospheric – dust blows across the cracked ground, and an enormous spaceship wreckage looms in the background. The prompt describes a slow dolly zoom on the marine’s face as he gazes at the wreck, conveying scale and gravity. Suddenly, holographic text appears in front of him (as if an AI interface, in the scene’s style). The camera then cuts to an over-the-shoulder shot showing a creature moving in the distance. The style is dramatic and immersive, like a high-end game trailer blending character drama with world-building."
      ]
    },
    {
      category: "Historical Drama Scene",
      prompts: [
        "{Era/setting}, {Characters}, {Event/action}, {Authentic visuals}, {Color tones}, {Camera work}",
        "A Victorian-era period drama scene in a grand manor. A lady in a lace gown stands by a window waiting anxiously as rain pours outside. The room is lit by flickering gaslight and candles, giving everything a warm, sepia tone. The prompt describes the camera panning slowly across antique furniture to the woman’s face (shown in a close-up reflecting in the glass). In the background, a faint silhouette of a man with an umbrella approaches through the rain (seen in soft focus). The style is emotional and old-fashioned, with a steady, deliberate camera capturing the detail of the period costume and set.",
        "A medieval battle camp at dawn, from a historical epic. Knights in battered armor gather around a campfire, their breath visible in the cold air. Tents and banners bearing a king’s crest dot the foggy field. The scene starts with an establishing wide shot of the encampment in the valley, then moves to a deep focus shot of the knights talking – we see both the men in the foreground and rows of horsemen preparing in the distance in focus. Natural light (the pale dawn) sets a somber mood. The camera gently dollies through the scene as one knight secures his sword, emphasizing the gritty realism and tension before battle."
      ]
    }
  ];
  
  const videoPromptStyle = [
    {
      category: "Visual Aesthetics",
      prompts: [
        "Cinematic", "Filmic", "Photorealistic", "Hyper-realistic", "Surreal", "Abstract", "Stylized", "Minimalist", "Maximalist", "Cartoonish",
        "Anime-style", "Comic book style", "Cyberpunk", "Steampunk", "Noir", "Vintage retro", "Modern sleek", "Futuristic", "High-tech holographic",
        "Dystopian", "Utopian", "Grunge", "Psychedelic", "Whimsical", "Epic scale", "Intimate", "Magical realism", "Baroque", "Fantasy art style",
        "Realistic CGI", "Hand-drawn", "Cel-shaded", "Vaporwave", "Experimental"
      ]
    },
    {
      category: "Genre & Theme Styles",
      prompts: [
        "Science fiction", "Fantasy", "Horror", "Thriller", "Mystery", "Romance", "Comedy", "Action/Adventure", "Superhero", "Noir detective",
        "Western", "Post-apocalyptic", "Dystopian future", "Utopian future", "Medieval", "Historical drama", "War film style", "Spy/Espionage",
        "Crime drama", "Mythological", "Steampunk theme", "Cyberpunk cityscape", "Space opera", "Zombie apocalypse", "Supernatural", "Fairy tale",
        "Slice of life", "Musical", "Documentary style", "Film noir", "Epic historical", "Surrealist", "Detective mystery", "Sports drama"
      ]
    },
    {
      category: "Lighting Styles",
      prompts: [
        "Natural lighting", "Soft lighting", "Hard lighting", "Warm lighting", "Cool lighting", "High-key lighting", "Low-key lighting", "Key light",
        "Fill light", "Back lighting", "Rim lighting", "Side lighting", "Top lighting", "Underlighting", "Ambient light", "Practical lighting",
        "Motivated lighting", "Studio lighting", "Stage spotlight", "Neon lighting", "Candlelight", "Firelight", "Golden hour", "Blue hour",
        "Moonlight", "Silhouette lighting", "Chiaroscuro", "Volumetric light", "Flashing strobe", "Color gel lighting", "High contrast lighting",
        "Flat lighting", "Dappled light", "UV/Blacklight"
      ]
    },
    {
      category: "Color Tones",
      prompts: [
        "Warm tones", "Cool tones", "Vibrant colors", "Saturated", "Desaturated", "Muted palette", "Monochrome", "Black and white", "Sepia",
        "High contrast", "Low contrast", "Pastel tones", "Neon colors", "Earth tones", "Teal and orange", "Bleach bypass", "Teal and orange contrast",
        "Cool blue tint", "Golden tint", "Color pop", "Retro color grading", "Cross-processed colors", "Duo-tone", "Rainbow palette",
        "Moody blue tones", "Greyscale", "Infrared palette", "High saturation", "Filmic colors", "Cartoon bright", "Comic book coloring",
        "Vibrant HDR", "Gothic muted"
      ]
    },
    {
      category: "Camera Movements",
      prompts: [
        "Static shot", "Pan", "Tilt", "Zoom in", "Zoom out", "Dolly in", "Dolly out", "Tracking shot", "Trucking shot", "Crane shot",
        "Jib shot", "Steadicam shot", "Handheld shot", "Gimbal shot", "Drone shot", "Aerial shot", "Arc shot", "Whip pan", "Whip tilt",
        "Rack focus", "Push in", "Pull out", "360-degree shot", "POV moving shot", "Tracking POV", "Long take / Oner", "Slow motion movement",
        "Time-lapse pan", "Tabletop spin", "Vertigo shot", "Pedestal move", "Tilt-pan combination", "Roll"
      ]
    },
    {
      category: "Camera Angles & Shot Types",
      prompts: [
        "Eye-level shot", "High-angle shot", "Low-angle shot", "Bird’s-eye view", "Worm’s-eye view", "Dutch angle", "Over-the-shoulder (OTS) shot",
        "Point-of-view (POV) shot", "First-person perspective", "Aerial perspective", "Overhead shot", "Close-up (CU)", "Extreme close-up (ECU)",
        "Medium shot", "Medium close-up", "Medium long shot", "Long shot / Wide shot", "Extreme wide shot", "Establishing shot", "Two-shot",
        "Three-shot", "Group shot", "Overhead two-shot", "Master shot", "Cut-in shot", "Cutaway shot", "Reaction shot", "Insert shot",
        "Lock-down shot", "OTS dialog shot", "Panoramic shot", "Tilted shot"
      ]
    },
    {
      category: "Composition Techniques",
      prompts: [
        "Rule of thirds", "Centered composition", "Symmetrical framing", "Asymmetrical composition", "Leading lines", "Diagonal lines",
        "Leading diagonals", "Balance", "Imbalance", "Frame within a frame", "Foreground framing", "Background framing", "Depth of field",
        "Shallow focus", "Deep focus", "Negative space", "Filled frame", "Leading room", "Head room", "Horizon line placement",
        "Golden ratio composition", "Triangular composition", "Rule of odds", "Repetition", "Symmetry and patterns", "Texture emphasis",
        "Silhouette composition", "Background separation", "Visual hierarchy", "Golden triangle", "Eye leading", "Subframing"
      ]
    },
    {
      category: "Lens & Filter Effects",
      prompts: [
        "Bokeh", "Shallow depth of field", "Rack focus", "Lens flare", "Anamorphic lens flare", "Fish-eye distortion", "Wide-angle distortion",
        "Telephoto compression", "Macro close-up", "Tilt-shift effect", "Soft focus filter", "Diffusion glow", "Vignette", "Film grain",
        "Film burn", "VHS glitch", "Chromatic aberration", "High dynamic range (HDR) effect", "Sepia filter", "Noir filter",
        "Color grading filter", "Infrared filter", "X-ray effect", "Heat vision/thermal effect", "Night vision effect", "Motion blur",
        "Long exposure light trails", "Double exposure", "Ghosting", "Kaleidoscope effect", "Holographic overlay", "Vintage film filter"
      ]
    },
    {
      category: "Cinematic Techniques & Special Effects",
      prompts: [
        "Slow motion", "Fast motion", "Time-lapse", "Hyperlapse", "Stop-motion style", "Freeze frame", "Bullet time", "Dolly zoom",
        "One-shot sequence", "Montage sequence", "Split screen", "Green screen compositing", "Chroma key effect", "Match cut", "Jump cut",
        "Smash cut", "Crossfade", "Whip pan transition", "Fade to black", "Dream sequence effect", "Flashback cut", "Fast cut edits",
        "Slow dissolve", "Match dissolve", "Wipe transition", "Graphic overlay", "CGI effects", "Practical effects", "Miniature effects",
        "Pyrotechnics", "Motion capture", "Fourth wall break", "Slow push-in", "Crash zoom", "Speed ramping"
      ]
    },
    {
      category: "Animation & Medium Styles",
      prompts: [
        "2D animation", "3D animation", "Hand-drawn animation", "Anime style animation", "Cartoon style", "Motion graphics",
        "Stop-motion animation", "Claymation", "Puppetry", "Live-action", "Mixed media", "Rotoscoping", "Cut-out animation",
        "Silhouette animation", "Pixel art animation", "Low-poly CGI", "Vector art style", "Stick-figure animation",
        "Clay sculpture animation", "CGI realism", "Cel animation", "Flipbook style", "Typography animation", "Whiteboard animation",
        "Infographic animation", "Animatronic", "VR animation", "Stop-motion with objects", "Experimental animation",
        "Clay/Puppet hybrid", "High frame rate animation", "Vintage Disney style", "Unreal engine cinematic"
      ]
    },

    {
      category: "Film Format & Texture",
      prompts: [
        "35mm film look", "16mm film", "8mm film", "VHS tape look", "DVD quality", "4K UHD", "Black and white", "Technicolor",
        "Sepia tone", "Silent film style", "Letterboxed", "Widescreen 2.35:1", "IMAX full-frame", "Handheld camcorder",
        "Found footage", "Newsreel vintage", "Polaroid look", "Overexposed highlights", "Underexposed shadows", "Film grain texture",
        "Crispy sharp", "Soft focus vintage lens", "Vignette edges", "Color bleed", "HDR toning", "Bloom effect", "Frame jitter",
        "Scan lines", "Dust and scratches", "Clean digital", "Cinemascope", "Technicolor palette", "High frame rate"
      ]
    },
    {
      category: "Editing & Transitions",
      prompts: [
        "Cut", "Hard cut", "Jump cut", "Match cut", "L-cut", "J-cut", "Cross-cutting", "Parallel editing", "Montage",
        "Continuous take", "Fast cutting", "Slow cutting", "Dissolve", "Crossfade", "Fade in", "Fade out", "Wipe", "Iris in/out",
        "Smash cut", "Cutaway", "Insert", "Match dissolve", "Jump dissolve", "Wipe", "Split edit", "Freeze-frame", "Speed ramp",
        "Cut to black", "Flash cut", "Montage sequence", "Continuity editing", "Jumpy editing", "Non-linear narrative", "Slow fade",
        "Cross-cut montage", "Parallel action"
      ]
    }
  ];