# Cinematic Robot GLB / GLTF

把真正电影级机器人模型文件放到这个目录，推荐文件名：

```text
public/models/robot.glb
```

项目启动后 Three.js 会按顺序加载：

1. `/models/robot.glb`
2. `/models/robot.gltf`
3. Three.js 官方示例 `RobotExpressive.glb` 作为演示级兜底模型

## 模型要求

- 推荐格式：`.glb`
- 推荐带动画：Idle / Walk / Run / Gesture 任意一种即可
- 推荐面数：Web 端建议控制在 30k - 150k triangles，移动端越低越好
- 推荐贴图：2K 以内，包含 baseColor / normal / roughness / metallic
- 命名建议：`robot.glb`

## 注意

GitHub 文本 API 不适合直接写入大型二进制 `.glb`。你可以在本地把购买或下载的模型复制到 `public/models/robot.glb`，然后执行：

```bash
git add public/models/robot.glb
git commit -m "add cinematic robot model"
git push
```

Vercel 自动重新部署后，页面会优先加载这个真正的本地电影级机器人模型。
